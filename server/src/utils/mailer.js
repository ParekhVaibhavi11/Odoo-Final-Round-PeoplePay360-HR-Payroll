const nodemailer = require('nodemailer');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465,
  auth: env.smtp.user
    ? {
        user: env.smtp.user,
        pass: env.smtp.pass,
      }
    : undefined,
});

/**
 * Sends a password reset email to a user.
 * @param {string} toEmail
 * @param {string} resetToken
 */
const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const resetUrl = `${env.clientUrl}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"PeoplePay360" <${env.smtp.from}>`,
    to: toEmail,
    subject: 'Password Reset Request - PeoplePay360',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #4f46e5;">PeoplePay360 Password Reset</h2>
        <p>You requested a password reset for your account. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>This link is valid for <strong>30 minutes</strong>. If you did not request this, please ignore this email.</p>
        <p style="font-size: 12px; color: #777777; margin-top: 30px;">If the button does not work, copy and paste this URL into your browser:<br/><a href="${resetUrl}">${resetUrl}</a></p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Sends a payslip PDF attachment to an employee.
 * @param {string} toEmail
 * @param {string} employeeName
 * @param {string} periodName
 * @param {Buffer} pdfBuffer
 */
const sendPayslipEmail = async (toEmail, employeeName, periodName, pdfBuffer) => {
  const mailOptions = {
    from: `"PeoplePay360 Payroll" <${env.smtp.from}>`,
    to: toEmail,
    subject: `Your Payslip for ${periodName} - PeoplePay360`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #4f46e5;">PeoplePay360 Payslip Notice</h2>
        <p>Dear ${employeeName},</p>
        <p>Please find attached your payslip for the pay period <strong>${periodName}</strong>.</p>
        <p>Best regards,<br/>Payroll Department</p>
      </div>
    `,
    attachments: [
      {
        filename: `Payslip_${employeeName.replace(/\s+/g, '_')}_${periodName}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendPasswordResetEmail,
  sendPayslipEmail,
};
