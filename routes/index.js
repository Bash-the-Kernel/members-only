const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { User, Message } = require('../models');

// Home page
router.get('/', async (req, res) => {
  const messages = await Message.findAll({ include: User, order: [['timestamp', 'DESC']] });
  res.render('index', { user: req.user, messages });
});

// Sign-up form
router.get('/sign-up', (req, res) => res.render('sign-up'));

// Process sign-up
router.post('/sign-up', [
  check('firstName').trim().notEmpty(),
  check('lastName').trim().notEmpty(),
  check('username').isEmail().normalizeEmail(),
  check('password').isLength({ min: 6 }),
  check('confirmPassword').custom((value, { req }) => value === req.body.password)
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).render('sign-up', { errors: errors.array() });

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: hashedPassword
    });
    res.redirect('/login');
  } catch (err) {
    res.status(500).send('Error creating user');
  }
});

// Login form
router.get('/login', (req, res) => res.render('login'));

// Process login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Join club form
router.get('/join-club', ensureAuthenticated, (req, res) => res.render('join-club'));

// Process join club
router.post('/join-club', ensureAuthenticated, async (req, res) => {
  if (req.body.passcode === process.env.MEMBERSHIP_PASSCODE) {
    await req.user.update({ memberStatus: true });
    res.redirect('/');
  } else {
    res.render('join-club', { error: 'Incorrect passcode' });
  }
});

// Create message form
router.get('/create-message', ensureAuthenticated, (req, res) => res.render('create-message'));

// Process create message
router.post('/create-message', ensureAuthenticated, async (req, res) => {
  await Message.create({
    title: req.body.title,
    text: req.body.text,
    UserId: req.user.id
  });
  res.redirect('/');
});

// Delete message (admin only)
router.post('/delete-message/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  await Message.destroy({ where: { id: req.params.id } });
  res.redirect('/');
});

// Middleware functions
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

function ensureAdmin(req, res, next) {
  if (req.user.admin) return next();
  res.redirect('/');
}

module.exports = router;