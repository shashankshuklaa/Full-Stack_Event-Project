import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pkg from "pg";

const { Pool } = pkg;

const app = express();

/* =========================
   BASIC MIDDLEWARE
========================= */

app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true
}));

app.use(express.json());

/* =========================
   SESSION CONFIG (PRODUCTION SAFE)
========================= */

app.set("trust proxy", 1); // Required for Render (HTTPS)

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // MUST be true on Render (HTTPS)
      httpOnly: true,
      sameSite: "none"
    }
  })
);

/* =========================
   PASSPORT INIT
========================= */

app.use(passport.initialize());
app.use(passport.session());

/* =========================
   DATABASE (Render PostgreSQL)
========================= */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* =========================
   AUTO CREATE USERS TABLE
========================= */

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      google_id TEXT UNIQUE,
      name TEXT,
      email TEXT UNIQUE
    );
  `);

  console.log("Users table ready");
}

/* =========================
   PASSPORT GOOGLE STRATEGY
========================= */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails } = profile;

        const email = emails[0].value;

        const existingUser = await pool.query(
          "SELECT * FROM users WHERE google_id = $1",
          [id]
        );

        if (existingUser.rows.length > 0) {
          return done(null, existingUser.rows[0]);
        }

        const newUser = await pool.query(
          "INSERT INTO users (google_id, name, email) VALUES ($1, $2, $3) RETURNING *",
          [id, displayName, email]
        );

        return done(null, newUser.rows[0]);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, user.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

/* =========================
   ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("Event App Running Successfully 🚀");
});

/* Google Login */
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/* Google Callback */
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/"
  }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || "/");
  }
);

/* Get Logged User */
app.get("/api/user", (req, res) => {
  if (!req.user) return res.json({ user: null });
  res.json({ user: req.user });
});

/* Logout */
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 10000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initDB();
});
