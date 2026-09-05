const { query } = require('../../config/database');

const findUserByEmail = async (email) => {
  const res = await query(
    `SELECT u.*, e.first_name, e.last_name, e.department, e.job_position 
     FROM users u 
     LEFT JOIN employees e ON u.employee_id = e.id 
     WHERE u.email = $1`,
    [email]
  );
  return res.rows[0] || null;
};

const findUserById = async (id) => {
  const res = await query(
    `SELECT u.id, u.email, u.role, u.employee_id, u.created_at, 
            e.first_name, e.last_name, e.department, e.job_position, e.employee_number 
     FROM users u 
     LEFT JOIN employees e ON u.employee_id = e.id 
     WHERE u.id = $1`,
    [id]
  );
  return res.rows[0] || null;
};

const createPasswordResetToken = async (userId, tokenHash, expiresAt) => {
  // Invalidate any previous reset tokens for this user
  await query('UPDATE password_resets SET used = TRUE WHERE user_id = $1', [userId]);

  const res = await query(
    `INSERT INTO password_resets (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, tokenHash, expiresAt]
  );
  return res.rows[0];
};

const findValidResetToken = async (tokenHash) => {
  const res = await query(
    `SELECT * FROM password_resets 
     WHERE token_hash = $1 AND used = FALSE AND expires_at > NOW()`,
    [tokenHash]
  );
  return res.rows[0] || null;
};

const markTokenAsUsed = async (tokenId) => {
  await query('UPDATE password_resets SET used = TRUE WHERE id = $1', [tokenId]);
};

const updateUserPassword = async (userId, passwordHash) => {
  await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
    passwordHash,
    userId,
  ]);
};

module.exports = {
  findUserByEmail,
  findUserById,
  createPasswordResetToken,
  findValidResetToken,
  markTokenAsUsed,
  updateUserPassword,
};
