import express from 'express';
import passport from 'passport';

const router = express.Router();

// User is sent to Google to log in and approve your app.
router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email", "https://mail.google.com/"],
    accessType: "offline", // so you get refreshToken
    // prompt: "consent" // forces the consent screen again to get updated scopes
}));


// What to do based on Google log in.
router.get("/google/callback", passport.authenticate("google", {
  successRedirect: "https://mailsweep-frontend.vercel.app/home",       
  failureRedirect: "https://mailsweep-frontend.vercel.app/login",
}));


router.post('/logout', function(req, res, next) {  // copied directly from doc. 
  req.logout(function(err) { // will remove the req.user (wipes the entire session) 
    if (err) { return next(err); }
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // name of the session cookie by default
      res.status(200).json({ message: 'Logged out successfully' }); 
    });
  });
});


router.get('/home', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Google OAuth is working' });
});


router.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

export default router;
