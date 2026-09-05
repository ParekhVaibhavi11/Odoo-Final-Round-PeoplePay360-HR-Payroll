const notifRepo = require('./notification.repository');

const getNotifications = async (userId) => {
  return await notifRepo.findByUser(userId);
};

const markRead = async (id, userId) => {
  return await notifRepo.markAsRead(id, userId);
};

const markAllRead = async (userId) => {
  return await notifRepo.markAllAsRead(userId);
};

module.exports = {
  getNotifications,
  markRead,
  markAllRead,
};
