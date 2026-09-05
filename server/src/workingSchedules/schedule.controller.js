const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const { getPagination, formatPaginatedResponse } = require('../../utils/pagination');
const scheduleService = require('./schedule.service');

const getSchedules = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query.page, req.query.limit);
  const { rows, total } = await scheduleService.getAllSchedules({ limit, offset });
  const responseData = formatPaginatedResponse(rows, total, page, limit);

  return res.status(200).json(new ApiResponse(200, responseData, 'Working schedules retrieved successfully'));
});

const getSchedule = asyncHandler(async (req, res) => {
  const schedule = await scheduleService.getScheduleById(req.params.id);
  return res.status(200).json(new ApiResponse(200, schedule, 'Working schedule details retrieved successfully'));
});

const createSchedule = asyncHandler(async (req, res) => {
  const newSchedule = await scheduleService.createSchedule(req.body);
  return res.status(201).json(new ApiResponse(201, newSchedule, 'Working schedule created successfully'));
});

const updateSchedule = asyncHandler(async (req, res) => {
  const updatedSchedule = await scheduleService.updateSchedule(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, updatedSchedule, 'Working schedule updated successfully'));
});

const deleteSchedule = asyncHandler(async (req, res) => {
  await scheduleService.deleteSchedule(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, 'Working schedule deleted successfully'));
});

module.exports = {
  getSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
