const ApiError = require('../../utils/ApiError');
const payrollRepo = require('./payroll.repository');
const ruleRepo = require('../salaryRules/salaryRule.repository');
const structureRepo = require('../salaryStructures/salaryStructure.repository');
const { calculateEmployeePayslip } = require('./salaryCalculator.service');

// --- Payrun Handlers ---
const getAllPayruns = async ({ limit, offset, status }) => {
  return await payrollRepo.findAllPayruns({ limit, offset, status });
};

const getPayrunById = async (id) => {
  const payrun = await payrollRepo.findPayrunById(id);
  if (!payrun) {
    throw new ApiError(404, 'Payrun batch record not found');
  }
  const payslips = await payrollRepo.findPayslipsByPayrun(id);
  return {
    ...payrun,
    payslips,
  };
};

/**
 * 2-Step Payrun Setup Wizard & Computation Trigger
 */
const createAndComputePayrun = async (data, userId) => {
  const structure = await structureRepo.findById(data.salary_structure_id);
  if (!structure) {
    throw new ApiError(404, 'Salary Structure record not found');
  }

  // Fetch ordered rules for structure
  const rules = await ruleRepo.findAllByStructure(data.salary_structure_id);

  // 1. Create Payrun Batch Header
  const payrun = await payrollRepo.createPayrun({
    name: data.name,
    period_start: data.period_start,
    period_end: data.period_end,
    salary_structure_id: data.salary_structure_id,
    created_by: userId,
  });

  // 2. Compute individual employee payslips
  for (const empId of data.employee_ids) {
    const slipData = await calculateEmployeePayslip(
      empId,
      data.period_start,
      data.period_end,
      data.salary_structure_id,
      rules
    );

    // Save payslip record
    const createdSlip = await payrollRepo.createPayslip({
      payrun_id: payrun.id,
      employee_id: slipData.employee_id,
      contract_id: slipData.contract_id,
      salary_structure_id: slipData.salary_structure_id,
      worked_days: slipData.worked_days,
      worked_hours: slipData.worked_hours,
      basic_wage: slipData.basic_wage,
      gross_amount: slipData.gross_amount,
      deduction_amount: slipData.deduction_amount,
      net_amount: slipData.net_amount,
      warnings: slipData.warnings,
      status: 'DRAFT',
    });

    // Save individual rule lines
    await payrollRepo.createPayslipLines(createdSlip.id, slipData.lines);
  }

  // Update Payrun Status to COMPUTED
  await payrollRepo.updatePayrunStatus(payrun.id, 'COMPUTED');

  return await getPayrunById(payrun.id);
};

const validatePayrun = async (id) => {
  const payrun = await payrollRepo.findPayrunById(id);
  if (!payrun) throw new ApiError(404, 'Payrun not found');

  await payrollRepo.updatePayrunStatus(id, 'VALIDATED');
  await payrollRepo.updatePayslipsStatusByPayrun(id, 'VALIDATED');

  return await getPayrunById(id);
};

const markPayrunPaid = async (id) => {
  const payrun = await payrollRepo.findPayrunById(id);
  if (!payrun) throw new ApiError(404, 'Payrun not found');

  await payrollRepo.updatePayrunStatus(id, 'PAID');
  await payrollRepo.updatePayslipsStatusByPayrun(id, 'PAID');

  return await getPayrunById(id);
};

const deletePayrun = async (id) => {
  const payrun = await payrollRepo.findPayrunById(id);
  if (!payrun) throw new ApiError(404, 'Payrun not found');
  if (payrun.status === 'PAID') {
    throw new ApiError(400, 'Cannot delete a finalized and PAID payrun batch');
  }

  await payrollRepo.deletePayslipsByPayrun(id);
  return await payrollRepo.deletePayrun(id);
};

// --- Payslip Detailed Views ---
const getPayslipById = async (id) => {
  const slip = await payrollRepo.findPayslipById(id);
  if (!slip) throw new ApiError(404, 'Payslip record not found');

  const lines = await payrollRepo.findPayslipLines(id);
  return {
    ...slip,
    lines,
  };
};

module.exports = {
  getAllPayruns,
  getPayrunById,
  createAndComputePayrun,
  validatePayrun,
  markPayrunPaid,
  deletePayrun,
  getPayslipById,
};
