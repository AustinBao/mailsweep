import pg from "pg";
import cors from 'cors'
import env from "dotenv";
import express from 'express'
import { google } from 'googleapis';  // googleapis gives you tools to talk to Google services (like Gmail).
import passport from "passport";
import session from 'express-session';  
import GoogleStrategy from "passport-google-oauth2";
import processMessage from "./processMessage.js";


const app = express()
const PORT = 3001
env.config();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true  // tells the server to allow cookies from frontend
}));

app.use(session({
  secret: process.env.SECRET_KEY, // prevents fake logins
  resave: false, // the session is only saved if it was modified.
  saveUninitialized: false, // Stores a session even before the user logs in. Set to false in docs.
  cookie: { maxAge: 1000 * 60 * 60 * 24}  // 1000 mil x 60 = 1 min x 60 = 1 hour * 24 = 1 day
}));

app.use(passport.initialize()); // starts Passport. Also adds req.isAuthenticated(), req.user, and other helpful methods.
app.use(passport.session()); // lets Passport use sessions to keep users logged in (stored in a cookie).

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL, // uses Supabase URL to connect
  ssl: { rejectUnauthorized: false }, // required for Supabase
});
db.connect();

async function savePageToken(userId, token) {
  try {
    await db.query(
      `UPDATE users SET page_token = $1 WHERE id = $2`,
      [token, userId]
    );
    
  } catch (err) {
    console.error("Cant save page token: ", err);
  }
}

async function getPageToken(userId) {
  try {
    const result = await db.query(
      `SELECT page_token FROM users WHERE id = $1`,
      [userId]
    );
    return result.rows[0].page_token;

  } catch (err) {
    console.error("Cant get page token: ", err);
    return null;
  }
}

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


app.get("/api/people", async (req, res) => {
  if (!req.isAuthenticated()) { 
    return res.status(401).send("Not authenticated");
  }
  res.json(req.user.profile_pic);
});

app.get("/api/userGmailInfo", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Not Authenticated")
  }
  const accessToken = req.user.accessToken
  const userId = req.user.id

  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({ access_token: accessToken })
  const gmail = google.gmail({ version: "v1", auth: oauth2Client})

  try {
    const result = await gmail.users.getProfile({userId: 'me'})
    const messagesTotal = result.data.messagesTotal
    const threadsTotal = result.data.threadsTotal
    console.log(threadsTotal, messagesTotal, "HELLO THIS IS A TEST MESSAGE PLEASE SEE THIS")
  } catch (err) {
    console.log(err)
    res.status(500).send("Failed to fetch Gmail data");
  }
  
})


// let currentPageToken = null;
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
    const currentPageToken = await getPageToken(userId);

    const result = await gmail.users.messages.list({
      userId: "me",  // userId: "me" means “use the currently authenticated user.”
      labelIds: ['INBOX'], // look only in inbox
      maxResults: 10,
      pageToken: currentPageToken,
    })

    if (!result.data.messages || result.data.messages.length === 0) {  // when we reach the end of the inbox
      await savePageToken(userId, null);  // clear page_token in db if no more emails
      return res.status(200).json({ done: true, messages: [] });
    }

    const nextToken  = result.data.nextPageToken
    if (nextToken ) {
      await savePageToken(userId, nextToken ); // save the new page token to page_token
    }

    let unsubLinks = []
    let senders = []
    let sender_addresses = []
    let email_ids = []
    let domain_pics = []

    for (let message of result.data.messages) {
      const data = await processMessage(gmail, message.id)
      if (data) {
        let rawSender = data.sender;
        let sender = "";
        let sender_address = "";

        if (rawSender.includes("<")) {
          let indexOfSenderAddress = rawSender.indexOf("<");
          sender = rawSender.slice(0, indexOfSenderAddress).trim().replace(/^"+|"+$/g, '');  // removes surrounding quotes
          sender_address = rawSender.slice(indexOfSenderAddress)
        } else {
          sender = ""; // or rawSender if you want to treat this as the sender name
          sender_address = rawSender.trim();
        }
        
        unsubLinks.push(data.unsubLink)
        senders.push(sender)
        sender_addresses.push(sender_address)
        email_ids.push(message.id)
        domain_pics.push(getFaviconURL(sender_address))
      } 
    }

    // console.log(unsubLinks, senders, email_ids)
    for (let i = 0; i < senders.length; i++) {
      saveSubscriptionsToDB(userId, senders[i], sender_addresses[i], unsubLinks[i], email_ids[i], domain_pics[i]);
    }

    // res.json(result.data);
    res.status(200).json({ done: !nextToken, messages: result.data.messages });

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch Gmail data");
  }
}); 

function getRootDomain(domain) {
  const parts = domain.split('.');
  return parts.slice(-2).join('.'); 
}

function getFaviconURL(rawEmail) {
  // Remove angle brackets if they exist
  const email = rawEmail.replace(/[<>]/g, "").trim();
  const rawDomain = email.split('@')[1];
  const domain = getRootDomain(rawDomain)
  return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
}

// 1. get message id from gmail API (5 emails)
// 2. Some will be unique -> add to db as unique sender addresses. The repeated emails (we check by sender
//    address) -> log them in the mail_to_delete table with the parent sender address id which came first as the key.  
// 3. When user clicks batch delete link, it pulls * where id = parent sender address id. 

async function saveSubscriptionsToDB (userId, sender, sender_address, unsubLink, email_id, domain_pic) {
  const result = await db.query(`INSERT INTO subscriptions 
    (user_id, email_id, sender, sender_address, subject, unsubscribe_link, is_unsubscribed, unsubscribed_at, domain_pic) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
    ON CONFLICT (user_id, sender_address) DO NOTHING RETURNING id`, // will stop the error from being triggered if (user_id, sender_address) pair already exists.
    [userId, email_id, sender, sender_address, null, unsubLink, false, null, domain_pic]
  );

  if (result.rows.length === 0) {
    const subResult = await db.query(`
      SELECT id FROM subscriptions WHERE user_id = $1 AND sender_address = $2
    `, [userId, sender_address]);

    const subscriptionId = subResult.rows[0]?.id;
    if (subscriptionId) {
      await db.query(`
        INSERT INTO mail_to_delete (subscription_id, email_id)
        VALUES ($1, $2) ON CONFLICT (email_id) DO NOTHING
      `, [subscriptionId, email_id]);
    }
  }
}

app.get('/auth/google/home', async (request, response) => {
    response.status(200).json({
      status: 'success',
      message: 'Google OAuth is working',
    })
})

app.get('/api/subscriptions', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Not authenticated");
  }

  const userId = req.user.id;
  try {
    const result = await db.query(
      'SELECT * FROM subscriptions WHERE user_id = $1',
      [userId]
    );
    res.json(result.rows);
    // console.log(tempDB.length);
    // res.json(tempDB); 
  } catch (err) {
    console.error('Error fetching subscriptions:', err);
    res.status(500).send('Error retrieving subscriptions');
  }
});

app.get('/api/mailCounters', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Not authenticated");
  }

  try {
    const userId = req.user.id;
    const result = await db.query(`
      SELECT s.id AS subscription_id, COUNT(m.email_id) AS email_count
      FROM subscriptions s
      LEFT JOIN mail_to_delete m ON s.id = m.subscription_id
      WHERE s.user_id = $1
      GROUP BY s.id
    `, [userId]);

    const counts = {};
    result.rows.forEach(row => {
      counts[row.subscription_id] = parseInt(row.email_count);
    });

    res.json(counts);
  } catch (err) {
    console.error("Error fetching email counts:", err);
    res.status(500).send("Error retrieving email counts");
  }
});

app.get('/api/check-auth', (req, res) => { 
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// User is sent to Google to log in and approve your app.
app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email", "https://mail.google.com/"],
    accessType: "offline", // so you get refreshToken
    prompt: "consent" // forces the consent screen again to get updated scopes
}));

// What to do based on Google log in.
app.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: "http://localhost:5173/home",       
  failureRedirect: "http://localhost:5173/login",
}));

app.post('/logout', function(req, res, next) {  // copied directly from doc. 
  req.logout(function(err) { // will remove the req.user (wipes the entire session) 
    if (err) { return next(err); }
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // name of the session cookie by default
      res.status(200).json({ message: 'Logged out successfully' }); 
    });
  });
});

app.post('/unsub', async (req, res) => { 
  const email_id = req.body.email_id;
  await db.query(`UPDATE subscriptions SET is_unsubscribed = $1 WHERE id = $2`, 
    [true, email_id]
  );
  res.status(200).json("Successfully updated is_unsubscribed")
});

app.post('/delete', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Not authenticated");
  }
  const subscription_id = req.body.subscription_id;

  const allMailToDelete = await db.query(`SELECT * FROM mail_to_delete WHERE subscription_id = $1`, 
    [subscription_id]
  );

  const originalMailToDelete = await db.query(`SELECT email_id FROM subscriptions WHERE id = $1`, 
    [subscription_id]
  );

  let emailIds = allMailToDelete.rows.map(item => item.email_id);
  emailIds.push(originalMailToDelete.rows[0].email_id)

  console.log(emailIds)

  if (!emailIds.length) {
    return res.status(404).json({ message: 'No emails to delete.' });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3001/auth/google/callback" // must match the one used during login
  );
  oauth2Client.setCredentials({ access_token: req.user.accessToken, refresh_token: req.user.refreshToken });
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  
  try {
    // const deleteResult = await gmail.users.messages.batchDelete({userId: "me", requestBody: {"ids": emailIds}})
    // console.log(deleteResult)
    console.log("You clicked delete")
    // res.status(200).json(deleteResult)
  } catch (err){
    console.log("Couldnt delete mail: " + err)
  }
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
      const userProfilePic = profile.photos[0].value;

      const result = await db.query("SELECT * FROM users WHERE email = $1", [userEmail]);
      let user;
      
      if (result.rows.length === 0) {    // New USER
        const newUser = await db.query("INSERT INTO users (google_id, email, name, profile_pic) VALUES ($1, $2, $3, $4) RETURNING *", 
          [userId, userEmail, userFullName, userProfilePic]
        );
        user = newUser.rows[0];

      } else {   // Existing USER
        user = result.rows[0];
      }
      user.accessToken = accessToken;
      user.refreshToken = refreshToken; 

      return cb(null, user); // This tells Passport: “Here’s the logged-in user. Save them to the session.”
    } catch (err) {
      return cb(err);
    }
  }) 
)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})