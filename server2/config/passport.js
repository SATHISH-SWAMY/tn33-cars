import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config(); // ✅ Make sure this is present and at the top

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// serializeUser
passport.serializeUser((user, done) => done(null, user.id));
// After successful login (e.g., via Google OAuth), Passport calls this method.
// You decide which piece of user data gets stored in the session; here it's user.id.
// Internally, this gets saved in the session cookie like:
// Why just the ID? It keeps session size small and avoids outdated data storage. If user info changes (profile, email, etc.), you'll always fetch fresh info next time

// deserializeUser
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});
// This method is called on every request after the user has logged in.
// It's used to retrieve the user data from the database by their ID.


