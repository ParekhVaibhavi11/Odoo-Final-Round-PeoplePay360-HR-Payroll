const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const notifService = require('./notification.service');

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifs = await notifService.getNotifications(req.user.id);
  return res.status(200).json(new ApiResponse(200, notifs, 'Notifications fetched successfully'));
});

const markAsRead = asyncHandler(async (req, res) => {
  const notif = await notifService.markRead(req.params.id, req.user.id);
  return res.status(200).json(new ApiResponse(200, notif, 'Notification marked as read'));
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await notifService.markAllRead(req.user.id);
  return res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read'));
});

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
};
