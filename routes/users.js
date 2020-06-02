const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const router = express.Router();
const auth = require('../middleware/auth');
const { User } = require('../models/user');
const validateRequest = require('../middleware/validateRequest');

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post(
  '/',
  [
    body('name')
      .trim()
      .isLength({ min: 5, max: 50 })
      .withMessage('name must be between 5 and 50'),
    body('email')
      .trim()
      .isLength({ min: 5, max: 255 })
      .isEmail()
      .withMessage('must be an valid email'),
    body('password')
      .trim()
      .isLength({ min: 5, max: 1024 })
      .withMessage('password must be at least 5 characters long'),
    validateRequest
  ],
  async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res
      .header('x-auth-token', token)
      .send(_.pick(user, ['_id', 'name', 'email']));
  }
);

module.exports = router;
