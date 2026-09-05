const pool = require("../config/db");

async function findUserByEmail(email) {
  const query = `
    SELECT
      u.id,
      u.email,
      u.password_hash,
      u.role_id,
      u.is_active,
      u.must_change_password,
      u.last_login_at,
      r.name AS role_name
    FROM users u
    INNER JOIN roles r
      ON u.role_id = r.id
    WHERE u.email = $1
    LIMIT 1;
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0] || null;
}

async function findUserById(userId) {
  const query = `
    SELECT
      u.id,
      u.email,
      u.role_id,
      u.is_active,
      u.must_change_password,
      u.last_login_at,
      r.name AS role_name
    FROM users u
    INNER JOIN roles r
      ON u.role_id = r.id
    WHERE u.id = $1
    LIMIT 1;
  `;

  const result = await pool.query(query, [userId]);

  return result.rows[0] || null;
}

async function findUserByIdForPassword(userId) {
  const query = `
    SELECT
      id,
      email,
      password_hash,
      is_active
    FROM users
    WHERE id = $1
    LIMIT 1;
  `;

  const result = await pool.query(query, [userId]);

  return result.rows[0] || null;
}

async function updateLastLogin(userId) {
  const query = `
    UPDATE users
    SET
      last_login_at = NOW(),
      updated_at = NOW()
    WHERE id = $1
    RETURNING id, last_login_at;
  `;

  const result = await pool.query(query, [userId]);

  return result.rows[0] || null;
}

async function updatePassword(userId, passwordHash) {
  const query = `
    UPDATE users
    SET
      password_hash = $1,
      must_change_password = FALSE,
      updated_at = NOW()
    WHERE id = $2
    RETURNING id, email, must_change_password;
  `;

  const result = await pool.query(query, [passwordHash, userId]);

  return result.rows[0] || null;
}

module.exports = {
  findUserByEmail,
  findUserById,
  findUserByIdForPassword,
  updateLastLogin,
  updatePassword,
};