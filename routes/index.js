require('dotenv').config();

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { User, Message } = require('../models');

// Add error handling middleware
const handleAsyncErrors = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Home page (with proper error handling)
router.get('/', handleAsyncErrors(async (req, res) => {
  const messages = await Message.findAll({ 
    include: {
      model: User,
      as: 'User', // Ensure the alias matches the association
      attributes: ['firstName', 'lastName', 'memberStatus']
    },
    order: [['createdAt', 'DESC']]
  });
  console.log('Fetched messages:', JSON.stringify(messages, null, 2)); // Debugging
  res.render('index', { user: req.user, messages });
}));

// Sign-up form
router.get('/sign-up', (req, res) => {
  res.render('sign-up', { errors: [], formData: {} });
});

router.post('/sign-up', [
  // ... existing validators ...
], handleAsyncErrors(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('sign-up', { 
      errors: errors.array(),
      formData: req.body
    });
  }

  // Check for existing user
  const existingUser = await User.findOne({ where: { username: req.body.username } });
  if (existingUser) {
    req.flash('error', 'Username already exists'); // Use req.flash
    return res.status(400).render('sign-up', {
      errors: [{ msg: 'Username already exists' }],
      formData: req.body
    });
  }

  // Create new user
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: hashedPassword
  });

  req.flash('success', 'Sign-up successful! Please log in.'); // Use req.flash
  res.redirect('/login');
}));

// Login form
router.get('/login', (req, res) => {
  res.render('login', { error: req.flash('error') });
});

// Process login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Login error:', err);
      return next(err);
    }
    if (!user) {
      req.flash('error', info.message);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return next(err);
      }
      console.log('User logged in:', user);
      req.flash('success', 'Welcome back!');
      return res.redirect('/');
    });
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return next(err);
    }
    req.flash('success', 'You have been logged out.');
    res.redirect('/');
  });
});

// Process join club

router.get('/join-club', ensureAuthenticated, (req, res) => {
  const error = req.flash('error')[0] || null; // Get the first error message (if any)
  console.log('Rendering join-club with error:', error); // Debugging
  res.render('join-club', { error: error }); // Explicitly pass the error variable
});

// Process join club
router.post('/join-club', ensureAuthenticated, handleAsyncErrors(async (req, res) => {
  const enteredPasscode = req.body.passcode.trim(); // Trim whitespace
  const correctPasscode = process.env.MEMBERSHIP_PASSCODE ? process.env.MEMBERSHIP_PASSCODE.trim() : null; // Trim whitespace and handle undefined

  console.log('Entered Passcode:', enteredPasscode);
  console.log('Correct Passcode:', correctPasscode);

  if (!correctPasscode) {
    req.flash('error', 'Membership passcode is not set. Please contact the administrator.');
    return res.redirect('/join-club');
  }

  if (enteredPasscode === correctPasscode) {
    await req.user.update({ memberStatus: true });
    req.flash('success', 'Welcome to the club!');
    console.log('Passcode correct, redirecting to home page.');
    return res.redirect('/');
  } else {
    req.flash('error', 'Incorrect passcode');
    console.log('Passcode incorrect, redirecting to join-club page.');
    return res.redirect('/join-club');
  }
}));

// Process create message

router.get('/create-message', ensureAuthenticated, (req, res) => {
  res.render('create-message', { errors: [], formData: {} });
});

// Process create message
router.post('/create-message', ensureAuthenticated, [
  check('title').trim().notEmpty().withMessage('Title is required'),
  check('text').trim().notEmpty().withMessage('Message text is required')
], handleAsyncErrors(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('create-message', {
      errors: errors.array(),
      formData: req.body
    });
  }

  console.log('Creating message with userId:', req.user.id); // Debugging
  await Message.create({
    title: req.body.title,
    text: req.body.text,
    userId: req.user.id // Ensure the foreign key matches the association
  });

  req.flash('success', 'Message created successfully');
  res.redirect('/');
}));

// Delete message (admin only)
router.post('/delete-message/:id', ensureAuthenticated, ensureAdmin, handleAsyncErrors(async (req, res) => {
  await Message.destroy({ where: { id: req.params.id } });
  req.flash('success', 'Message deleted successfully');
  res.redirect('/');
}));

// Middleware functions
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('User is authenticated:', req.user);
    return next();
  }
  req.flash('error', 'Please log in to access that page');
  res.redirect('/login');
}

function ensureAdmin(req, res, next) {
  if (req.user?.admin) {
    return next();
  }
  req.flash('error', 'Unauthorized access');
  res.redirect('/');
}

function ensureAdmin(req, res, next) {
  if (req.user?.admin) return next();
  req.flash('error', 'Unauthorized access');
  res.redirect('/');
}

module.exports = router;