const app = require('./app');
const env = require('./config/env');
const { pool } = require('./config/database');

const startServer = async () => {
  try {
    // Verify DB connectivity
    const res = await pool.query('SELECT NOW()');
    console.log(`Connected to PostgreSQL Database [${env.db.name}] successfully at ${res.rows[0].now}`);

    app.listen(env.port, () => {
      console.log(`====================================================`);
      console.log(`  PeoplePay360 Backend API Server Running          `);
      console.log(`  Environment: ${env.nodeEnv}                      `);
      console.log(`  Listening on Port: ${env.port}                   `);
      console.log(`  Client URL Allowed: ${env.clientUrl}             `);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Failed to start backend server due to database connection failure:', error);
    process.exit(1);
  }
};

startServer();
