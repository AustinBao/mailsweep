import cors from 'cors'
import express from 'express'
import session from 'express-session';  
import passport from "./config/passport.js";
import pgSession from 'connect-pg-simple'

import authRoutes from './routes/auth.js';
import gmailRoutes from './routes/gmail.js';
import subscriptionRoutes from './routes/subscriptions.js';
import mailCounterRoutes from './routes/mailcounter.js';
import pictureRoute from './routes/picture.js';


const app = express()
const PORT = process.env.PORT || 3001;  // Railway automatically sets process.env.PORT

const PgSession = pgSession(session)

app.use(express.json());

app.use(cors({
  origin: 'https://mailsweep-frontend.vercel.app', 
  credentials: true  // tells the server to allow cookies from frontend
}));

app.use(session({
  store: new PgSession({
    pool: db,            // Uses pg.Pool from db.js
    tableName: 'session' // Optional: default is 'session'
  }),
  secret: process.env.SECRET_KEY, // prevents fake logins
  resave: false, // the session is only saved if it was modified.
  saveUninitialized: false, // Stores a session even before the user logs in. Set to false in docs.
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: "none",     
    secure: true         
  }  // 1000 mil x 60 = 1 min x 60 = 1 hour * 24 = 1 day
}));

app.use(passport.initialize()); // starts Passport. Also adds req.isAuthenticated(), req.user, and other helpful methods.
app.use(passport.session()); // lets Passport use sessions to keep users logged in (stored in a cookie).


app.use('/auth', authRoutes);
app.use('/gmail', gmailRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/mailcounter', mailCounterRoutes);
app.use('/picture', pictureRoute);

app.get('/', async (req, res) => {
  res.status(200).json({message: 'Server is live'})
})

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})