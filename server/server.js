import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;
const app = express();
app.use(cors({ origin: 'https://mrhillsy.github.io' }));
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "geoapp",
  password: "11112228", // replace with your DB password
  port: 5432,
});

// ✅ Create table if not exists
async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS facilities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        category VARCHAR(50),
        city VARCHAR(50),
        geom GEOMETRY(Point, 4326)
      );
    `);
    console.log("✅ Table 'facilities' ensured");
  } catch (error) {
    console.error("❌ Error creating table:", error);
  }
}

// ✅ Load sample data if empty
async function loadData() {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM facilities");
    if (parseInt(result.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO facilities (name, category, city, geom) VALUES
        ('Central School', 'School', 'New York', ST_SetSRID(ST_MakePoint(-73.935242, 40.73061), 4326)),
        ('General Hospital', 'Hospital', 'New York', ST_SetSRID(ST_MakePoint(-73.945242, 40.74061), 4326)),
        ('City Bank', 'Bank', 'Brooklyn', ST_SetSRID(ST_MakePoint(-73.955242, 40.72061), 4326)),
        ('Green Park', 'Park', 'Queens', ST_SetSRID(ST_MakePoint(-73.965242, 40.75061), 4326));
      `);
      console.log("✅ Sample data inserted into facilities");
    } else {
      console.log("✅ Facilities table already has data");
    }
  } catch (error) {
    console.error("❌ Error loading data:", error);
  }
}

// ✅ API: Fetch all facilities or by city
app.get("/api/facilities", async (req, res) => {
  const { city } = req.query;

  try {
    let query =
      "SELECT id, name, category, city, ST_X(geom) AS lon, ST_Y(geom) AS lat FROM facilities";
    let params = [];

    if (city && city !== "All") {
      query += " WHERE city = $1";
      params.push(city);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch facilities" });
  }
});

// ✅ API: Fetch insights for a city
app.get("/api/insights/:city", async (req, res) => {
  const { city } = req.params;

  try {
    const result = await pool.query(
      `SELECT category, COUNT(*) as count FROM facilities
       WHERE city = $1 GROUP BY category`,
      [city]
    );

    const insights = result.rows.map((row) => {
      if (row.category === "School")
        return `📚 ${city} has ${row.count} schools, showing strong education infrastructure.`;
      if (row.category === "Hospital")
        return `🏥 ${city} provides ${row.count} hospitals, ensuring healthcare accessibility.`;
      if (row.category === "Bank")
        return `🏦 ${city} offers ${row.count} banks for financial support.`;
      if (row.category === "Park")
        return `🌳 ${city} includes ${row.count} parks for recreation.`;
      if (row.category === "Supermarket")
        return `🛒 ${city} has ${row.count} supermarkets for convenient shopping.`;
      if (row.category === "Police")
        return `👮 ${city} ensures security with ${row.count} police stations.`;
      return null;
    }).filter(Boolean);

    res.json(insights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch insights" });
  }
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, async () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  await createTable();
  await loadData();
});
fetch(`${import.meta.env.VITE_API_URL}/facilities`)
  .then(res => res.json())
  .then(data => console.log('API data:', data))
  .catch(err => console.error('Fetch error:', err));
