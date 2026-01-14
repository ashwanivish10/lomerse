import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// ✅ CORRECT Import (Must use the named export)
// import { User } from "../models/usermodel"; // Correct path to your model
import { User } from '../models/User';

// This function is called to save the user's ID to the session cookie.
passport.serializeUser((user: any, done) => {
  // We save the user's _id (which is their Google ID string) to the session.
  // user.id is a mongoose virtual getter for _id, this is correct.
  done(null, user.id);
});

// This function is called to retrieve the user's full data from the database
// using the ID we stored in the session cookie.
passport.deserializeUser(async (id: string, done) => {
  try {
    // Use User.findById directly. Since our _id is a string, this works.
    const user = await User.findById(id);
    // The user object is attached to the request as req.user
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      // Options for the Google strategy
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // This function runs after a user successfully signs in with Google.
      // 'profile' contains their information from Google.
      try {
        // 1. Check if user already exists in our database
        // ❗ FIX: Use '_id' (lowercase) to find the user
        const existingUser = await User.findOne({ _id: profile.id });

        if (existingUser) {
          // If they do, we're done. Pass their data to the next step.
          console.log('Existing user found:', existingUser.name);
          done(null, existingUser);
        } else {
          // 2. If not, create a new user in our database
          // ❗ FIX: Use User.create() directly to create the new user
          const newUser = await User.create({
            _id: profile.id, // Use the Google profile ID as our _id
            googleId: profile.id, // Also save it to the googleId field
            name: profile.displayName,
            email: profile.emails ? profile.emails[0].value : '',
           avatarUrl: profile.photos ? profile.photos[0].value : '',
            // Set default values for new users
            subscriptionStatus: 'inactive',
            subscriptionTier: 'free',
          });
          console.log('New user created:', newUser.name);
          done(null, newUser);
        }
      } catch (error) {
        // If there's a database error, let Passport know.
        done(error, undefined);
      }
    }
  )
);
