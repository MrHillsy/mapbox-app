const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ✅ API route
app.get("/api/facilities", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, category, city,
      ST_X(geom::geometry) AS lon,
      ST_Y(geom::geometry) AS lat
      FROM facilities
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
