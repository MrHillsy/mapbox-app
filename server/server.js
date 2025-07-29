import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // needed for Railway SSL
});

const cors = require("cors");
app.use(cors());


const app = express();
app.use(cors());

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;



// ✅ API Endpoint: Fetch all facilities with coordinates
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

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
