import fetch from "node-fetch";
import pkg from "pg";
import cors from "cors";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",          // Your Postgres username
  host: "localhost",
  database: "geoapp",        // Your database name
  password: "11112228",  // Your Postgres password
  port: 5432
});

const cities = [
  { name: "New York", bbox: "40.700292,-74.019257,40.878178,-73.906158" },
  { name: "Brooklyn", bbox: "40.570742,-74.041878,40.739446,-73.833365" },
  { name: "Queens", bbox: "40.541722,-73.961292,40.800708,-73.700272" }
];

const categories = [
  { key: "school", type: "amenity" },
  { key: "hospital", type: "amenity" },
  { key: "bank", type: "amenity" },
  { key: "supermarket", type: "shop" },
  { key: "police", type: "amenity" },
  { key: "park", type: "leisure" }
];

const buildQuery = (bbox) => {
  let query = `[out:json][timeout:25];(`;
  categories.forEach(cat => {
    query += `node["${cat.type}"="${cat.key}"](${bbox});`;
  });
  query += `);out;`;
  return query;
};

const getCategory = (el) => {
  if (el.tags.amenity === "school") return "School";
  if (el.tags.amenity === "hospital") return "Hospital";
  if (el.tags.amenity === "bank") return "Bank";
  if (el.tags.shop === "supermarket") return "Supermarket";
  if (el.tags.amenity === "police") return "Police";
  if (el.tags.leisure === "park") return "Park";
  return null;
};

const fetchAndInsert = async () => {
  for (const city of cities) {
    console.log(`📡 Fetching data for ${city.name}...`);
    const query = buildQuery(city.bbox);

    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query
      });
      const data = await response.json();

      for (const el of data.elements) {
        const category = getCategory(el);
        if (!category) continue;

        const name = el.tags.name || "Unnamed";
        const lon = el.lon;
        const lat = el.lat;

        await pool.query(
          `INSERT INTO facilities (id, name, category, city, geom)
           VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326))
           ON CONFLICT (id) DO NOTHING`,
          [el.id, name, category, city.name, lon, lat]
        );
      }

      console.log(`✅ Inserted facilities for ${city.name}`);
    } catch (error) {
      console.error(`❌ Error fetching data for ${city.name}:`, error);
    }
  }

  console.log("🎯 Data loading complete!");
  await pool.end();
};
fetch("http://localhost:5000/api/facilities")
  .then((res) => res.json())
  .then((data) => console.log(data));

fetchAndInsert().catch(err => console.error(err));
