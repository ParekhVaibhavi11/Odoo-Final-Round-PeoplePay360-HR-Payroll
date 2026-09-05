const fs = require("fs");
const path = require("path");

const pool = require("../config/db");

const MIGRATIONS_DIR = path.join(__dirname, "migrations");

async function runMigrations() {
  const client = await pool.connect();

  try {
    console.log("🔄 Starting database migrations...");

    // Create migration tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Read migration files
    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    // Get already executed migrations
    const result = await client.query(`
      SELECT filename
      FROM schema_migrations
      ORDER BY filename;
    `);

    const executedMigrations = new Set(
      result.rows.map((row) => row.filename)
    );

    for (const file of files) {
      if (executedMigrations.has(file)) {
        console.log(`⏭️  Skipping ${file}`);
        continue;
      }

      console.log(`▶️  Running ${file}...`);

      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, "utf8");

      await client.query("BEGIN");

      try {
        await client.query(sql);

        await client.query(
          `
          INSERT INTO schema_migrations (filename)
          VALUES ($1);
          `,
          [file]
        );

        await client.query("COMMIT");

        console.log(`✅ ${file} completed`);
      } catch (error) {
        await client.query("ROLLBACK");

        console.error(`❌ ${file} failed`);
        throw error;
      }
    }

    console.log("🎉 All migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:");
    console.error(error.message);

    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();