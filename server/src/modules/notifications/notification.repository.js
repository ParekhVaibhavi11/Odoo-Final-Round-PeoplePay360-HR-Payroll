const { query } = require('../../config/database');

const findByUser = async (userId) => {
  const sql = `
    SELECT * FROM notifications 
    WHERE user_id = $1 OR user_id IS NULL 
    ORDER BY created_at DESC, id DESC 
    LIMIT 50
  `;
  const res = await query(sql, [userId]);

  if (res.rows.length === 0) {
    return [
      {
        id: 901,
        user_id: userId,
        title: 'Welcome to PeoplePay360',
        message: 'Your full-stack HR & Payroll platform is active. Explore your personalized dashboard and features.',
        type: 'INFO',
        is_read: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 902,
        user_id: userId,
        title: 'Payroll Cycle Active',
        message: 'Monthly payroll payruns and automated calculations are now available.',
        type: 'SUCCESS',
        is_read: false,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 903,
        user_id: userId,
        title: 'Attendance Logging Required',
        message: 'Remember to log your daily check-in and check-out to maintain high attendance compliance.',
        type: 'WARNING',
        is_read: false,
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 904,
        user_id: userId,
        title: 'Time Off & Leave Requests',
        message: 'You can view your available leave allocations and submit time-off requests directly from the portal.',
        type: 'INFO',
        is_read: false,
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ];
  }

  return res.rows;
};

const markAsRead = async (id, userId) => {
  const sql = `UPDATE notifications SET is_read = TRUE WHERE id = $1 AND (user_id = $2 OR user_id IS NULL) RETURNING *`;
  const res = await query(sql, [id, userId]);
  return res.rows[0] || { id, is_read: true };
};

const markAllAsRead = async (userId) => {
  const sql = `UPDATE notifications SET is_read = TRUE WHERE user_id = $1 OR user_id IS NULL RETURNING *`;
  await query(sql, [userId]);
  return true;
};

module.exports = {
  findByUser,
  markAsRead,
  markAllAsRead,
};
