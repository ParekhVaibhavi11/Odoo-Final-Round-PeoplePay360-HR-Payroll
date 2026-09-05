const pool = require("../config/db");

async function createRefreshToken({
  userId,
  tokenHash,
  expiresAt,
}) {
  const query = `
    INSERT INTO refresh_tokens (
      user_id,
      token_hash,
      expires_at
    )
    VALUES ($1, $2, $3)
    RETURNING id, user_id, expires_at, created_at;
  `;

  const result = await pool.query(query, [
    userId,
    tokenHash,
    expiresAt,
  ]);

  return result.rows[0];
}

async function findRefreshToken(tokenHash) {
  const query = `
    SELECT
      id,
      user_id,
      token_hash,
      expires_at,
      revoked_at,
      replaced_by_token_hash
    FROM refresh_tokens
    WHERE token_hash = $1
    LIMIT 1;
  `;

  const result = await pool.query(query, [tokenHash]);

  return result.rows[0] || null;
}

async function revokeRefreshToken(
  tokenHash,
  replacedByTokenHash = null
) {
  const query = `
    UPDATE refresh_tokens
    SET
      revoked_at = NOW(),
      replaced_by_token_hash = $2
    WHERE token_hash = $1
      AND revoked_at IS NULL
    RETURNING id, revoked_at;
  `;

  const result = await pool.query(query, [
    tokenHash,
    replacedByTokenHash,
  ]);

  return result.rows[0] || null;
}

async function revokeAllUserRefreshTokens(userId) {
  const query = `
    UPDATE refresh_tokens
    SET revoked_at = NOW()
    WHERE user_id = $1
      AND revoked_at IS NULL;
  `;

  await pool.query(query, [userId]);
}

module.exports = {
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
};