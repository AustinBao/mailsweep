import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import db from "./db.js";


passport.serializeUser((user, cb) => {
  cb(null, user);  // stores the user object in session upon login
});

passport.deserializeUser((user, cb) => {
  cb(null, user);  // load the saved user from session
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

export default passport;
