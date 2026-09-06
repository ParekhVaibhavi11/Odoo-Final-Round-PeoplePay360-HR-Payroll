const PDFDocument = require('pdfkit');

/**
 * Generates a printable PDF Document buffer for a single payslip.
 */
const generatePayslipPdfBuffer = (payslip, lines) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Header
      doc.fontSize(22).fillColor('#4f46e5').text('PeoplePay360', { align: 'left' });
      doc.fontSize(10).fillColor('#6b7280').text('Integrated HR & Payroll Operations Platform', { align: 'left' });
      doc.moveDown(1.5);

      // Payslip Title & Status Badge
      doc.fontSize(16).fillColor('#111827').text(`PAYSLIP RECORD #${payslip.id}`, { underline: true });
      doc.moveDown(0.5);

      // Employee Info Grid
      doc.fontSize(11).fillColor('#374151');
      doc.text(`Employee Name: ${payslip.first_name} ${payslip.last_name}`);
      doc.text(`Employee Number: ${payslip.employee_number}`);
      doc.text(`Department: ${payslip.department || 'N/A'}`);
      doc.text(`Job Position: ${payslip.job_position || 'N/A'}`);
      doc.text(`Pay Structure: ${payslip.structure_name || 'Standard'}`);
      doc.text(`Worked Days / Hours: ${payslip.worked_days} Days / ${payslip.worked_hours} Hours`);
      doc.moveDown(1.5);

      // Table Header
      doc.fontSize(12).fillColor('#4f46e5').text('SALARY COMPUTATION BREAKDOWN', { underline: true });
      doc.moveDown(0.5);

      // Lines Table
      doc.fontSize(10).fillColor('#111827');
      doc.text('Rule Code', 40, doc.y, { width: 100, continued: true });
      doc.text('Name', 140, doc.y, { width: 180, continued: true });
      doc.text('Category', 320, doc.y, { width: 100, continued: true });
      doc.text('Amount ($)', 420, doc.y, { width: 100, align: 'right' });
      doc.moveDown(0.3);
      doc.text('---------------------------------------------------------------------------------------------------');
      doc.moveDown(0.5);

      for (const line of lines) {
        doc.text(line.code, 40, doc.y, { width: 100, continued: true });
        doc.text(line.name, 140, doc.y, { width: 180, continued: true });
        doc.text(line.category, 320, doc.y, { width: 100, continued: true });
        doc.text(`$${parseFloat(line.amount).toFixed(2)}`, 420, doc.y, { width: 100, align: 'right' });
        doc.moveDown(0.4);
      }

      doc.moveDown(1.5);

      // Summary Cards
      doc.fontSize(11).fillColor('#111827');
      doc.text(`Basic Wage: $${parseFloat(payslip.basic_wage).toFixed(2)}`, { align: 'right' });
      doc.text(`Gross Earnings: $${parseFloat(payslip.gross_amount).toFixed(2)}`, { align: 'right' });
      doc.text(`Total Deductions: -$${parseFloat(payslip.deduction_amount).toFixed(2)}`, { align: 'right' });
      doc.fontSize(14).fillColor('#4f46e5').text(`NET SALARY PAID: $${parseFloat(payslip.net_amount).toFixed(2)}`, { align: 'right' });

      // Footer
      doc.moveDown(3);
      doc.fontSize(9).fillColor('#9ca3af').text('Generated automatically by PeoplePay360 HR & Payroll Engine.', { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  generatePayslipPdfBuffer,
};
