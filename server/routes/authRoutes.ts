import { Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { storage } from '../storage';
import { User } from '../models/User';

const router = Router();

// ============================================
// 🔐 Google OAuth Routes
// ============================================

// Route #1: Start the Google authentication process
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// Route #2: The callback URL Google redirects to after the user logs in
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/signin' }),
  (req, res) => {
    // Successful authentication! Redirect to the root URL.
    res.redirect('/');
  }
);

// ============================================
// 🔐 Local Auth Routes (Email/Password)
// ============================================

// Route: Register a new user with email/password
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide name, email, and password'
      });
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email' });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate unique ID for local user
    const userId = nanoid(24);

    // Create user
    const newUser = await User.create({
      _id: userId,
      name,
      email,
      password: hashedPassword,
      authProvider: 'local',
      subscriptionStatus: 'inactive',
      subscriptionTier: 'free',
    });

    // Log in the user after registration
    req.login(newUser, (err) => {
      if (err) {
        console.error('Login error after registration:', err);
        return res.status(500).json({ message: 'Registration successful but login failed' });
      }

      res.status(201).json({
        message: 'Account created successfully',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        }
      });
    });

  } catch (error: any) {
    console.error('Registration error:', error);

    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'An account with this email already exists'
      });
    }

    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// Route: Login with email/password
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user registered with Google
    if (user.authProvider === 'google' || !user.password) {
      return res.status(401).json({
        message: 'This account uses Google sign-in. Please use the Google button.'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Log in the user
    req.login(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Login failed. Please try again.' });
      }

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      });
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// ============================================
// 🔓 Logout & User Status Routes
// ============================================

// Route #3: The endpoint for logging out
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // After logging out, redirect to the homepage.
    res.redirect('/');
  });
});

// Route #4: An API endpoint for the frontend to check user status
router.get('/user', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'No user authenticated' });
  }
});

export default router;
