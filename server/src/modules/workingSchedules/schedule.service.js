const ApiError = require('../../utils/ApiError');
const scheduleRepo = require('./schedule.repository');

const calculateWeeklyHours = (pattern) => {
  if (!Array.isArray(pattern)) return 0;
  let totalMinutes = 0;

  for (const dayItem of pattern) {
    if (dayItem.start_time && dayItem.end_time) {
      const [startH, startM] = dayItem.start_time.split(':').map(Number);
      const [endH, endM] = dayItem.end_time.split(':').map(Number);

      let dayMin = endH * 60 + endM - (startH * 60 + startM);
      const breakMin = parseInt(dayItem.break_minutes || 0, 10);
      dayMin -= breakMin;

      if (dayMin > 0) {
        totalMinutes += dayMin;
      }
    }
  }

  return parseFloat((totalMinutes / 60).toFixed(2));
};

const getAllSchedules = async ({ limit, offset }) => {
  return await scheduleRepo.findAll({ limit, offset });
};

const getScheduleById = async (id) => {
  const schedule = await scheduleRepo.findById(id);
  if (!schedule) {
    throw new ApiError(404, 'Working schedule record not found');
  }
  return schedule;
};

const createSchedule = async (data) => {
  const computedWeeklyHours = calculateWeeklyHours(data.pattern);
  return await scheduleRepo.create({
    ...data,
    weekly_hours: computedWeeklyHours,
  });
};

const updateSchedule = async (id, data) => {
  const existing = await scheduleRepo.findById(id);
  if (!existing) {
    throw new ApiError(404, 'Working schedule record not found');
  }

  const computedWeeklyHours = calculateWeeklyHours(data.pattern);
  return await scheduleRepo.update(id, {
    ...data,
    weekly_hours: computedWeeklyHours,
  });
};

const deleteSchedule = async (id) => {
  const schedule = await scheduleRepo.findById(id);
  if (!schedule) {
    throw new ApiError(404, 'Working schedule record not found');
  }
  return await scheduleRepo.remove(id);
};

module.exports = {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
