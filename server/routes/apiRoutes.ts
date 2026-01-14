import { Router, Request, Response, NextFunction } from 'express';
// import User from '../models/User'; // Humara User model
import { User } from '../models/User';

const router = Router();

// Yeh ek helper function (middleware) hai jo check karega ki user logged in hai ya nahi
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'User not authenticated' });
};

// --- Route 1: User ki profile update karne ke liye ---
// Frontend is par PUT request bhejega: /api/profile
router.put('/profile', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { name, companyName } = req.body;
    const userId = (req.user as any).id;

    if (!name || !companyName) {
      return res.status(400).json({ message: 'Name and Company Name are required.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { name, companyName } },
      { new: true } // Yeh option update hone ke baad naya user data return karta hai
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully!', user: updatedUser });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// --- Route 2: User ki settings update karne ke liye ---
// Frontend is par PUT request bhejega: /api/settings
router.put('/settings', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { aiSuggestionsEnabled, darkMode } = req.body;
    const userId = (req.user as any).id;

    const settingsToUpdate: { [key: string]: boolean } = {};
    if (aiSuggestionsEnabled !== undefined) {
      settingsToUpdate['settings.aiSuggestionsEnabled'] = aiSuggestionsEnabled;
    }
    if (darkMode !== undefined) {
      settingsToUpdate['settings.darkMode'] = darkMode;
    }

    if (Object.keys(settingsToUpdate).length === 0) {
        return res.status(400).json({ message: 'No settings provided to update.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: settingsToUpdate },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Settings updated successfully!', settings: updatedUser.settings });

  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error while updating settings' });
  }
});


export default router;
