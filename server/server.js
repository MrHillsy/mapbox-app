import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "geoapp",
  password: "11112228", // Replace with your real password
  port: 5432,
});

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
