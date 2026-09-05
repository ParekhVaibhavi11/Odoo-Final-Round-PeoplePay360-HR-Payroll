const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const routes = require('./routes');
const { errorHandler } = require('./middleware/error.middleware');
const ApiError = require('./utils/ApiError');

const routes = require("./src/routes");
const errorHandler = require("./src/middleware/error.middleware");

// Middlewares
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PeoplePay360 API is running 🚀",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'PeoplePay360 HR & Payroll Engine API',
  });
});

// Central API Routes
app.use('/api', routes);

// Handle 404 Undefined Routes
app.use((req, res, next) => {
  next(new ApiError(404, `Resource not found at route [${req.method} ${req.originalUrl}]`));
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
// API routes
app.use("/api", routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
