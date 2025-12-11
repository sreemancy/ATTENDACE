const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', { email: req.body.email, name: req.body.name });
    
    const { email, password, name } = req.body;
    
    // Basic validation
    if (!email || !password || !name) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Registration failed - user already exists:', email);
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Create new user
    const user = new User({ email, password, name });
    await user.save();
    
    console.log('User registered successfully:', user.email);
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'fallback-secret', 
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      } 
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      // Handle mongoose validation errors
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ 
        message: 'Validation error',
        errors: messages 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Email already registered' 
      });
    }
    
    res.status(500).json({ 
      message: 'Registration failed. Please try again.' 
    });
  }
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // In production, send email here
    console.log(`Reset token for ${email}: ${resetToken}`);
    
    res.json({ message: 'Reset token generated (check console in development)' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;