const {
  findUserByEmail,
  findUserById,
  findUserByIdForPassword,
  updateLastLogin,
  updatePassword,
} = require("../repositories/auth.repository");

const {
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
} = require("../repositories/refreshToken.repository");

const {
  comparePassword,
  hashPassword,
} = require("../utils/password");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

const crypto = require("crypto");

const {
  JWT_REFRESH_EXPIRES_IN,
} = require("../config/env");

function hashRefreshToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function getRefreshTokenExpiry() {
  const expiresIn = JWT_REFRESH_EXPIRES_IN;

  const match = String(expiresIn).match(
    /^(\d+)([smhd])$/
  );

  if (!match) {
    throw new Error(
      "Invalid JWT_REFRESH_EXPIRES_IN configuration"
    );
  }

  const value = Number(match[1]);
  const unit = match[2];

  const milliseconds = {
    s: value * 1000,
    m: value * 60 * 1000,
    h: value * 60 * 60 * 1000,
    d: value * 24 * 60 * 60 * 1000,
  };

  return new Date(Date.now() + milliseconds[unit]);
}

async function login(email, password) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.is_active) {
    throw new Error("Account is inactive");
  }

  const isPasswordValid = await comparePassword(
    password,
    user.password_hash
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  await updateLastLogin(user.id);

  const payload = {
    userId: user.id,
    email: user.email,
    roleId: user.role_id,
    role: user.role_name,
  };

  const accessToken = generateAccessToken(payload);

  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const expiresAt = getRefreshTokenExpiry();

  await createRefreshToken({
    userId: user.id,
    tokenHash: refreshTokenHash,
    expiresAt,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role_name,
      mustChangePassword: user.must_change_password,
    },
    accessToken,
    refreshToken,
  };
}

async function refreshAccessToken(refreshToken) {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }

  const oldTokenHash = hashRefreshToken(refreshToken);

  const storedToken = await findRefreshToken(oldTokenHash);

  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }

  if (storedToken.revoked_at) {
    // Possible token reuse — revoke all active sessions
    await revokeAllUserRefreshTokens(storedToken.user_id);

    throw new Error("Refresh token has been revoked");
  }

  if (new Date(storedToken.expires_at) <= new Date()) {
    throw new Error("Refresh token has expired");
  }

  if (String(decoded.userId) !== String(storedToken.user_id)) {
    throw new Error("Invalid refresh token");
  }

  const user = await findUserById(storedToken.user_id);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.is_active) {
    throw new Error("Account is inactive");
  }

  const payload = {
    userId: user.id,
    email: user.email,
    roleId: user.role_id,
    role: user.role_name,
  };

  const newAccessToken = generateAccessToken(payload);

  const newRefreshToken = generateRefreshToken({
    userId: user.id,
  });

  const newRefreshTokenHash =
    hashRefreshToken(newRefreshToken);

  const newExpiresAt = getRefreshTokenExpiry();

  await createRefreshToken({
    userId: user.id,
    tokenHash: newRefreshTokenHash,
    expiresAt: newExpiresAt,
  });

  await revokeRefreshToken(
    oldTokenHash,
    newRefreshTokenHash
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

async function logout(refreshToken) {
  if (!refreshToken) {
    return;
  }

  const tokenHash = hashRefreshToken(refreshToken);

  await revokeRefreshToken(tokenHash);
}

async function getCurrentUser(userId) {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.is_active) {
    throw new Error("Account is inactive");
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role_name,
    mustChangePassword: user.must_change_password,
    lastLoginAt: user.last_login_at,
  };
}

async function changePassword(
  userId,
  currentPassword,
  newPassword
) {
  const user = await findUserByIdForPassword(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.is_active) {
    throw new Error("Account is inactive");
  }

  const isCurrentPasswordValid = await comparePassword(
    currentPassword,
    user.password_hash
  );

  if (!isCurrentPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  const newPasswordHash = await hashPassword(newPassword);

  await updatePassword(userId, newPasswordHash);

  return {
    message: "Password changed successfully",
  };
}

module.exports = {
  login,
  refreshAccessToken,
  logout,
  getCurrentUser,
  changePassword,
};