import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const app = express();
const PORT = process.env.PORT || 10000;

/* ================= MIDDLEWARE ================= */

import session from "express-session";

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // production https
      httpOnly: true,
      sameSite: "none"
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* ================= DATABASE ================= */

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
// Automatically create users table
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE
      );
    `);
    console.log("Users table ready");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
})();

/* ================= PASSPORT ================= */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        const user = await pool.query(
          "SELECT * FROM users WHERE email=$1",
          [email]
        );

        if (user.rows.length === 0) {
          await pool.query(
            "INSERT INTO users (name, email) VALUES ($1,$2)",
            [profile.displayName, email]
          );
        }

        return done(null, profile);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

/* ================= AUTH ROUTES ================= */

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

app.get("/api/user", (req, res) => {
  res.json(req.user || null);
});

app.get("/api/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

/* ================= STATIC FRONTEND ================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build/index.html"));
});

/* ================= START ================= */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


