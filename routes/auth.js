const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { body } = require('express-validator');

const validationRequest = require('../middleware/validateRequest');

const { User } = require('../models/user');

router.post(
  '/',
  [
    body('name')
      .trim()
      .isLength({ min: 5, max: 50 })
      .withMessage('name must be between 5 and 50'),
    body('email')
      .trim()
      .isEmail()
      .isLength({ min: 5, max: 255 })
      .withMessage('Email must be valid'),
    validationRequest
  ],
  async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.send(token);
  }
);

module.exports = router;
