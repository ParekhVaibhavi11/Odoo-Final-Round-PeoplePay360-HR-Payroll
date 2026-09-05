const ApiError = require('../../utils/ApiError');
const attendanceRepo = require('./attendance.repository');
const employeeRepo = require('../employees/employee.repository');
const { calculateHoursWorked, formatISO } = require('../../utils/dateUtils');

const getAllAttendances = async ({ limit, offset, employee_id, startDate, endDate, status }) => {
  return await attendanceRepo.findAll({ limit, offset, employee_id, startDate, endDate, status });
};

const checkIn = async (employeeId, checkInTimeStr = null) => {
  const employee = await employeeRepo.findById(employeeId);
  if (!employee) {
    throw new ApiError(404, 'Employee record not found');
  }

  const now = checkInTimeStr ? new Date(checkInTimeStr) : new Date();
  const dateStr = formatISO(now);

  const existing = await attendanceRepo.findByEmployeeAndDate(employeeId, dateStr);
  if (existing && existing.check_in && !existing.check_out) {
    throw new ApiError(400, 'Employee is already checked in for today');
  }

  return await attendanceRepo.createOrUpdateCheckIn(employeeId, dateStr, now.toISOString(), 'PRESENT');
};

const checkOut = async (employeeId, checkOutTimeStr = null) => {
  const employee = await employeeRepo.findById(employeeId);
  if (!employee) {
    throw new ApiError(404, 'Employee record not found');
  }

  const now = checkOutTimeStr ? new Date(checkOutTimeStr) : new Date();
  const dateStr = formatISO(now);

  const existing = await attendanceRepo.findByEmployeeAndDate(employeeId, dateStr);
  if (!existing || !existing.check_in) {
    throw new ApiError(400, 'Employee must check in before checking out');
  }

  const workedHours = calculateHoursWorked(existing.check_in, now);
  const standardDailyHours = employee.weekly_hours ? parseFloat((employee.weekly_hours / 5).toFixed(2)) : 8.0;
  const overtimeHours = workedHours > standardDailyHours ? parseFloat((workedHours - standardDailyHours).toFixed(2)) : 0;

  return await attendanceRepo.updateCheckOut(existing.id, now.toISOString(), workedHours, overtimeHours);
};

const manualCorrection = async (id, data) => {
  const existing = await attendanceRepo.findById(id);
  if (!existing) {
    throw new ApiError(404, 'Attendance record not found');
  }

  let workedHours = data.worked_hours;
  if (data.check_in && data.check_out && workedHours === undefined) {
    workedHours = calculateHoursWorked(data.check_in, data.check_out);
  }

  return await attendanceRepo.manualCorrection(id, {
    ...data,
    worked_hours: workedHours || 0,
  });
};

const deleteAttendance = async (id) => {
  const existing = await attendanceRepo.findById(id);
  if (!existing) {
    throw new ApiError(404, 'Attendance record not found');
  }
  return await attendanceRepo.remove(id);
};

module.exports = {
  getAllAttendances,
  checkIn,
  checkOut,
  manualCorrection,
  deleteAttendance,
};
