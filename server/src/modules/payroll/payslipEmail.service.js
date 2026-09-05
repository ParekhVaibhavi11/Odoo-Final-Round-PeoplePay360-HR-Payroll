const { sendPayslipEmail } = require('../../utils/mailer');
const { generatePayslipPdfBuffer } = require('./payslipPdf.service');
const payrollRepo = require('./payroll.repository');

const sendSinglePayslipEmail = async (payslipId) => {
  const payslip = await payrollRepo.findPayslipById(payslipId);
  if (!payslip || !payslip.email) {
    throw new Error('Payslip or employee email not found');
  }

  const lines = await payrollRepo.findPayslipLines(payslipId);
  const pdfBuffer = await generatePayslipPdfBuffer(payslip, lines);

  const empName = `${payslip.first_name} ${payslip.last_name}`;
  const periodName = `Payrun #${payslip.payrun_id}`;

  await sendPayslipEmail(payslip.email, empName, periodName, pdfBuffer);
  return { success: true, email: payslip.email };
};

const sendBulkPayslipsEmail = async (payrunId) => {
  const payslips = await payrollRepo.findPayslipsByPayrun(payrunId);
  let sentCount = 0;

  for (const slip of payslips) {
    if (slip.email) {
      try {
        await sendSinglePayslipEmail(slip.id);
        sentCount++;
      } catch (err) {
        console.error(`Failed to send email for payslip #${slip.id}:`, err.message);
      }
    }
  }

  return { total: payslips.length, sent: sentCount };
};

module.exports = {
  sendSinglePayslipEmail,
  sendBulkPayslipsEmail,
};
