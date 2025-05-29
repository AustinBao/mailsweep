import pg from "pg";
import cors from 'cors'
import env from "dotenv";
import express from 'express'
import { google } from 'googleapis';  // googleapis gives you tools to talk to Google services (like Gmail).
import passport from "passport";
import session from 'express-session';  
import GoogleStrategy from "passport-google-oauth2";
import * as cheerio from 'cheerio';


const app = express()
const PORT = 3001
env.config();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true  // tells the server to allow cookies from frontend
}));

app.use(session({
  secret: process.env.SECRET_KEY, // prevents fake logins
  resave: false, // the session is only saved if it was modified.
  saveUninitialized: true, // Stores a session even before the user logs in. Set to false in docs...
  cookie: { maxAge: 1000 * 60 * 60 * 24}  // 1000 mil x 60 = 1 min x 60 = 1 hour * 24 = 1 day
}));

app.use(passport.initialize()); // starts Passport. Also adds req.isAuthenticated(), req.user, and other helpful methods.
app.use(passport.session()); // lets Passport use sessions to keep users logged in (stored in a cookie).

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL, // uses Supabase URL to connect
  ssl: { rejectUnauthorized: false }, // required for Supabase
});
db.connect();


passport.serializeUser((user, cb) => {
  cb(null, user);  // stores the user object in session upon login
});

passport.deserializeUser((user, cb) => {
  cb(null, user);  // load the saved user from session
});


app.get('/', async (request, response) => {
    response.status(200).json({
        status: 'success',
        message: 'REST APIs are working',
    })
})


app.get("/api/gmail", async (req, res) => {
  // req.isAuthenticated() is from Passport. Passport adds this new method to the req object.
  if (!req.isAuthenticated()) { 
    return res.status(401).send("Not authenticated");
  }
  const accessToken = req.user.accessToken;
  const userId = req.user.id;
  
  const oauth2Client = new google.auth.OAuth2();  //  creates a Google auth client.
  oauth2Client.setCredentials({ access_token: accessToken }); // add user's access token after logging in to Google.
  const gmail = google.gmail({ version: "v1", auth: oauth2Client }); // Now this client is authorized to access the user’s Gmail.
  // You’re telling Google: "I want to use Gmail API version 1." auth is your authorized client. Now you can call Gmail API methods.
  try {
    // userId: "me" means “use the currently authenticated user.”
    const result = await gmail.users.messages.list({ userId: "me", maxResults: 5 }); // users.messages.list is a Gmail API function.
    
    let unsubLinks = []
    let senders = []

    for (let message of result.data.messages) {
      const actualEmail = await gmail.users.messages.get({ userId: "me", id: message.id }); 
      
      const headers = actualEmail.data.payload.headers;
      // console.log(headers)
      
      let fromHeader;
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        if (header.name.toLowerCase() === "from") {
          fromHeader = header;
          break; 
        }
      }
      const sender = fromHeader ? fromHeader.value : "Unknown sender";
      console.log("Sender:", sender);

      let decodedString;
      let payload = actualEmail.data.payload
      if (payload.mimeType == "text/html"){
        decodedString = Buffer.from(payload.body.data, 'base64').toString('utf-8');
      } else if (payload.mimeType == "multipart/alternative" || payload.mimeType == "multipart/mixed") {  // handles multipart/alternative or mixed
        var parts = payload.parts

        while (parts.length) {
          //shift removes the first element of an array and returns it
          var part = parts.shift()
          if (part.parts) {
            parts = parts.concat(part.parts)
          } else if (part.mimeType === 'text/html') {
            decodedString = Buffer.from(part.body.data, 'base64').toString('utf-8')
            break
          }
        }
      } else {
        console.log(payload.mimeType)
      }
      
      if (decodedString) {
        const $ = cheerio.load(decodedString);
        const allLinks = $('a');
        const linkArray = allLinks.toArray();

        for (let i = 0; i < linkArray.length; i++) {
          const linkElement = linkArray[i];
          const linkText = $(linkElement).text().toLowerCase();   

          if (linkText.includes("unsubscribe")) {
            unsubLinks.push(linkElement.attribs.href);
            senders.push(sender)
          }
        }
      }
    }

    for (let i = 0; i < senders.length; i++) {
      saveSubscriptionsToDB()
    }

    // console.log(unsubLinks);
    console.log(senders)
    res.json(result.data);

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch Gmail data");
  }
});

async function saveSubscriptionsToDB (userId, sender, unsubLink) {
  await db.query("INSERT INTO subscriptions (user_id, sender_address, subject, unsubscribe_link, resubscribe_link, is_unsubscribed, unsubscribed_at) VALUES ($1, $2, $3, $4, $5, $6, $7)", 
    [userId, sender, null, unsubLink, null, false, null]
  );
}

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

// User is sent to Google to log in and approve your app.
app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/gmail.readonly"],
}));

// What to do based on Google log in.
app.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: "http://localhost:5173/home",       
  failureRedirect: "http://localhost:5173/login",
}));

app.post('/logout', function(req, res, next) {  // From doc. Not added yet
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

passport.use("google", new GoogleStrategy({  // GoogleStrategy is a Passport strategy that handles Google login for you
  clientID: process.env.GOOGLE_CLIENT_ID, //  from your Google Developer Console 
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // — proves your app is allowed to log people in.
  callbackURL: "http://localhost:3001/auth/google/callback", // after the user logs in, Google redirects them back to this route on your server.
  // userProfileURL: "https://www.goo gleapis.com/oauth2/v3/userinfo" // DEFAULT ROUTE. CAN REMOVE.
  }, async(accessToken, refreshToken, profile, cb) => {
    // accessToken: lets your server access the user’s Google data (like Gmail).
    // refreshToken: lets your server get a new access token if the old one expires (not always provided).
    // profile: contains the user’s basic Google profile info (like name, email, id).
    // cb: callback to finish the login and pass the user to Passport.
    try {
      const userFullName = profile.given_name + " " + profile.family_name;
      const userEmail = profile.email;
      const userId = profile.id;
      const result = await db.query("SELECT * FROM users WHERE email = $1", [userEmail]);
      let user;
      
      if (result.rows.length === 0) {    // New USER
        const newUser = await db.query("INSERT INTO users (google_id, email, name) VALUES ($1, $2, $3) RETURNING *", 
          [userId, userEmail, userFullName]
        );
        user = newUser.rows[0];

      } else {   // Existing USER
        user = result.rows[0];
      }
      user.accessToken = accessToken; 

      return cb(null, user); // This tells Passport: “Here’s the logged-in user. Save them to the session.”
    } catch (err) {
      return cb(err);
    }
  }) 
)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})