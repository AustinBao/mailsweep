import pg from "pg";
import cors from 'cors'
import env from "dotenv";
import express from 'express'
import { google } from 'googleapis';
import passport from "passport";
import bodyParser from "body-parser";
import session from 'express-session';
import GoogleStrategy from "passport-google-oauth2";

const app = express()
const PORT = 3001
env.config();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true  // needed for auth 
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SECRET_KEY, 
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24}  // 1000 mil x 60 = 1 min x 60 = 1 hour * 24 = 1 day
}));

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL, // use Supabase URL
  ssl: { rejectUnauthorized: false }, // required for Supabase
});
db.connect();


passport.serializeUser((user, cb) => {
  cb(null, user);  // stores the user object in session
});

passport.deserializeUser((user, cb) => {
  cb(null, user);  // gets the user object when reload
});

app.get('/', async (request, response) => {
    response.status(200).json({
        status: 'success',
        message: 'REST APIs are working',
    })
})


app.get("/api/gmail", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Not authenticated");
  }
  const accessToken = req.user.accessToken;
  console.log("Access Token:", accessToken);

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  try {
    const result = await gmail.users.messages.list({ userId: "me", maxResults: 5 });
    res.json(result.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch Gmail data");
  }
});


app.get('/auth/google/home', async (request, response) => {
    response.status(200).json({
      status: 'success',
      message: 'Google OAuth is working',
    })
})

app.get('/api/subscriptions', async (request, response) => {
  const result = await db.query('SELECT * FROM users');
  const subscriptions = result.rows;
  response.json(subscriptions);
})

// Route that starts Google OAuth login
app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/gmail.readonly"],
}));

// Google redirects to this route after user sign in
app.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: "http://localhost:5173/home",       
  failureRedirect: "http://localhost:5173/login",
}));

passport.use("google", new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/auth/google/callback",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  }, async(accessToken, refreshToken, profile, cb) => {
    try {
      const userFullName = profile.given_name + " " + profile.family_name;
      const userEmail = profile.email;
      const userId = profile.id;
      const result = await db.query("SELECT * FROM users WHERE email = $1", [userEmail]);
      let user;
      
      if (result.rows.length === 0) {    // New USER
        const newUser = await db.query("INSERT INTO users (google_id, email, name, access_token) VALUES ($1, $2, $3, $4) RETURNING *", 
          [userId, userEmail, userFullName, accessToken]
        );
        user = newUser.rows[0];

      } else {   // Existing USER
        user = result.rows[0];
      }
      user.accessToken = accessToken;

      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }) 
)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})