const fs = require("fs");
const path = require("path");

const pool = require("../config/db");

const SEEDS_DIR = path.join(__dirname, "seeds");

async function runSeeds() {
  const client = await pool.connect();

  try {
    console.log("🌱 Starting database seeds...");

    // Create seed tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_seeds (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Read seed files in alphabetical order
    const files = fs
      .readdirSync(SEEDS_DIR)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    // Get already executed seeds
    const result = await client.query(`
      SELECT filename
      FROM schema_seeds
      ORDER BY filename;
    `);

    const executedSeeds = new Set(
      result.rows.map((row) => row.filename)
    );

    for (const file of files) {
      if (executedSeeds.has(file)) {
        console.log(`⏭️  Skipping ${file}`);
        continue;
      }

      console.log(`▶️  Running ${file}...`);

      const filePath = path.join(SEEDS_DIR, file);
      const sql = fs.readFileSync(filePath, "utf8");

      await client.query("BEGIN");

      try {
        await client.query(sql);

        await client.query(
          `
          INSERT INTO schema_seeds (filename)
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

    console.log("🎉 All seeds completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:");
    console.error(error.message);

    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runSeeds();