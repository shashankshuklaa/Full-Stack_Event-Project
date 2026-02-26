import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

/* ================= DATABASE ================= */

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL not found");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

try {
  await pool.connect();
  console.log("✅ PostgreSQL Connected");
} catch (err) {
  console.error("❌ DB Connection Failed:", err.message);
  process.exit(1);
}

/* ============== CREATE TABLE IF NOT EXISTS ============== */

await pool.query(`
  CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    venue VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'upcoming'
  );
`);

/* ================= ROUTES ================= */

app.get("/", (req, res) => {
  res.send("🚀 Event App Running Successfully");
});

app.get("/api/events", async (req, res) => {
  const result = await pool.query("SELECT * FROM events ORDER BY id DESC");
  res.json(result.rows);
});

app.post("/api/events", async (req, res) => {
  const { title, date, venue, status } = req.body;

  if (!title || !date || !venue) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const result = await pool.query(
    "INSERT INTO events (title, date, venue, status) VALUES ($1,$2,$3,$4) RETURNING *",
    [title, date, venue, status || "upcoming"]
  );

  res.status(201).json(result.rows[0]);
});

app.delete("/api/events/:id", async (req, res) => {
  await pool.query("DELETE FROM events WHERE id=$1", [req.params.id]);
  res.json({ message: "Event deleted" });
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});