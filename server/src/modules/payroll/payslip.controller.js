const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const payrollService = require('./payroll.service');
const payrollRepo = require('./payroll.repository');
const { generatePayslipPdfBuffer } = require('./payslipPdf.service');
const payslipEmailService = require('./payslipEmail.service');

const getPayslip = asyncHandler(async (req, res) => {
  const payslip = await payrollService.getPayslipById(req.params.id);
  return res.status(200).json(new ApiResponse(200, payslip, 'Payslip details retrieved successfully'));
});

const downloadPayslipPdf = asyncHandler(async (req, res) => {
  const payslip = await payrollRepo.findPayslipById(req.params.id);
  if (!payslip) {
    return res.status(404).json({ message: 'Payslip not found' });
  }

  const lines = await payrollRepo.findPayslipLines(req.params.id);
  const pdfBuffer = await generatePayslipPdfBuffer(payslip, lines);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="Payslip_${payslip.employee_number}_Payrun_${payslip.payrun_id}.pdf"`
  );

  return res.send(pdfBuffer);
});

const sendPayslipEmail = asyncHandler(async (req, res) => {
  const result = await payslipEmailService.sendSinglePayslipEmail(req.params.id);
  return res.status(200).json(new ApiResponse(200, result, `Payslip email sent to ${result.email}`));
});

const sendBulkPayslipsEmail = asyncHandler(async (req, res) => {
  const result = await payslipEmailService.sendBulkPayslipsEmail(req.params.payrunId);
  return res.status(200).json(new ApiResponse(200, result, `Dispatched payslip emails to ${result.sent} employees`));
});

const getMyPayslips = asyncHandler(async (req, res) => {
  const employeeId = req.user.employee_id;
  if (!employeeId) {
    return res.status(200).json(new ApiResponse(200, [], 'No employee profile linked'));
  }
  const payslips = await payrollRepo.findPayslipsByEmployee(employeeId);
  return res.status(200).json(new ApiResponse(200, payslips, 'Employee payslips retrieved successfully'));
});

module.exports = {
  getPayslip,
  getMyPayslips,
  downloadPayslipPdf,
  sendPayslipEmail,
  sendBulkPayslipsEmail,
};
