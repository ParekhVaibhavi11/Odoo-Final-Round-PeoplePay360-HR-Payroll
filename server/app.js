const express = require("express");
const cors = require("cors");

const env = require("./config/env");
const routes = require("./routes");
const { errorHandler } = require("./middleware/error.middleware");
const ApiError = require("./utils/ApiError");

const app = express();

// =========================
// Middlewares
// =========================

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// Root Route
// =========================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PeoplePay360 API is running 🚀",
  });
});

// =========================
// Health Check
// =========================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
    service: "PeoplePay360 HR & Payroll Engine API",
  });
});

// =========================
// API Routes
// =========================

app.use("/api", routes);

// =========================
// 404 Handler
// =========================

app.use((req, res, next) => {
  next(
    new ApiError(
      404,
      `Resource not found at route [${req.method} ${req.originalUrl}]`
    )
  );
});

// =========================
// Global Error Handler
// =========================

app.use(errorHandler);

module.exports = app;