const calculateHoursWorked = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffMs = end - start;
  if (diffMs <= 0) return 0;
  return parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
};

const getDaysInPeriod = (startDateStr, endDateStr) => {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 0;
};

const isDateInRange = (dateStr, startStr, endStr) => {
  const target = new Date(dateStr);
  const start = new Date(startStr);
  const end = new Date(endStr);
  return target >= start && target <= end;
};

const formatISO = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

module.exports = {
  calculateHoursWorked,
  getDaysInPeriod,
  isDateInRange,
  formatISO,
};
