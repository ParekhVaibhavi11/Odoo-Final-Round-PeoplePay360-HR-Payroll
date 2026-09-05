const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.join(__dirname, "../../.env"),
  override: true,
});

const env = {
  port: Number(process.env.PORT || 5000),

  nodeEnv: process.env.NODE_ENV || "development",

  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    name: process.env.DB_NAME || "peoplepay360",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",

    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  smtp: {
    host: process.env.SMTP_HOST || process.env.EMAIL_HOST,
    port: Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587),
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD,
    from:
      process.env.SMTP_FROM ||
      process.env.EMAIL_USER ||
      "no-reply@peoplepay360.com",
  },
};

module.exports = env;