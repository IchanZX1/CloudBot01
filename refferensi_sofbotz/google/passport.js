const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { randomBytes } = require("crypto");
const config = require("../config.json");

module.exports = function initPassport(db) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.oauth.google.client_id,
        clientSecret: config.oauth.google.client_secret,
        callbackURL: config.oauth.google.callback_url,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          if (!profile.emails || !profile.emails.length) {
            return done(null, false);
          }

          const email = profile.emails[0].value;
          const username = profile.displayName || "Google User";

          const userRes = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
          );

          if (userRes.rows.length > 0) {
            return done(null, userRes.rows[0]);
          }

          const dummyPassword = await bcrypt.hash(
            randomBytes(64).toString("hex"),
            10
          );

          const {
            rows: [user],
          } = await db.query(
            `
            INSERT INTO users (email, username, password)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [email, username, dummyPassword]
          );

          const expired = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
          const botId = uuidv4();

          await db.query(
            `INSERT INTO bot (id, uid, expired, status, isactive, thumbnail, owner, botname, sticker_package, sticker_author, limit_value) 
             VALUES ($1, $2, $3, 'offline', true, $4, $5, $6, $7, $8, $9)`,
            [
              botId,
              user.id,
              expired,
              config.defaults.thumbnail,
              config.defaults.owner,
              config.defaults.botname,
              config.defaults.stickerPackage,
              config.defaults.stickerAuthor,
              config.defaults.limit,
            ]
          );

          return done(null, user);
        } catch (err) {
          console.error("Google auth error:", err);
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
      const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
      if (!res.rows.length) return done(null, false);
      done(null, res.rows[0]);
    } catch (err) {
      done(err, null);
    }
  });

  return passport;
};
