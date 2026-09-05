const app = require("./app");
const pool = require("./src/config/db");
const { PORT } = require("./src/config/env");

const port = PORT;

async function startServer() {
  try {
    
    await pool.query("SELECT 1");

    console.log("✅ Database connection successful");
    
    app.listen(port, () => {
      console.log(`🚀 PeoplePay360 server running on port ${port}`);
      console.log(`🌐 http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error.message);

    process.exit(1);
  }
}

startServer();