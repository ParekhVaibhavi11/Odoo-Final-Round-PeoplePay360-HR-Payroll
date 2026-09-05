const { query } = require('../../config/database');

const findAllUsers = async () => {
  const sql = `
    SELECT u.id, u.email, u.role, u.employee_id, u.created_at,
           e.first_name, e.last_name, e.department
    FROM users u
    LEFT JOIN employees e ON u.employee_id = e.id
    ORDER BY u.id ASC
  `;
  const res = await query(sql);
  return res.rows;
};

const createUser = async (email, passwordHash, role, employeeId) => {
  const sql = `
    INSERT INTO users (email, password_hash, role, employee_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, role, employee_id, created_at
  `;
  const res = await query(sql, [email, passwordHash, role || 'EMPLOYEE', employeeId || null]);
  return res.rows[0];
};

const updateUserRole = async (userId, role) => {
  const sql = `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, role`;
  const res = await query(sql, [role, userId]);
  return res.rows[0];
};

const findAllRoles = async () => {
  const res = await query('SELECT * FROM roles ORDER BY id ASC');
  return res.rows;
};

const findAllPermissions = async () => {
  const res = await query('SELECT * FROM permissions ORDER BY id ASC');
  return res.rows;
};

module.exports = {
  findAllUsers,
  createUser,
  updateUserRole,
  findAllRoles,
  findAllPermissions,
};
