const jwt = require("jsonwebtoken");

const {
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
} = require("../config/env");

function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, JWT_ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};