import pg from "pg";
import cors from 'cors'
import env from "dotenv";
import express from 'express'
import passport from "passport";
import bodyParser from "body-parser";
import session from 'express-session';
import GoogleStrategy from "passport-google-oauth2"


const app = express()
const PORT = 3001
env.config();

app.use(cors())
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

//database soon
let subscriptions = [
    {
     "id": "1",
     "address": "bob@gmail.com"
    },
    {
     "id": "2",
     "address": "sponge@gmail.com"
    }
]

app.get('/', async (request, response) => {
    const result = await db.query('SELECT * FROM users');
    console.log(result.rows)

    response.status(200).json({
        status: 'success',
        message: 'REST APIs are working',
    })
})

app.get('/auth/google/home', async (request, response) => {
    response.status(200).json({
        status: 'success',
        message: 'Google OAuth is working',
    })
})

app.get('/api/subscriptions', (request, response) => {
    response.json(subscriptions)
})

// Route that starts Google OAuth login
app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"],
}));

// Google redirects to this route after user sign in
app.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: "http://localhost:5173/home",       // successful
  failureRedirect: "http://localhost:5173/",      // unsuccessful (could go to login page or something)
}));

passport.use(
    "google",
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3001/auth/google/callback",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    }, async(accessToken, refreshToken, profile, cb) => {
        try {
        console.log(profile);
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          profile.email,
        ]);
        if (result.rows.length === 0) {
            const fullName = profile.given_name + " " + profile.family_name
          const newUser = await db.query(
            "INSERT INTO users (google_id, email, name) VALUES ($1, $2, $3)",
            [profile.id, profile.email, fullName]
          );
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    }) 
)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})