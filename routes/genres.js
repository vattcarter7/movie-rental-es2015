const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Genre } = require('../models/genre');
const validateRequest = require('../middleware/validateRequest');

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.post(
  '/',
  [
    auth,
    body('name')
      .trim()
      .isLength({ min: 5, max: 50 })
      .withMessage('Genre name must be between 5 and 50 characters'),
    validateRequest
  ],
  async (req, res) => {
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();

    res.send(genre);
  }
);

router.put(
  '/:id',
  [
    auth,
    validateObjectId,
    body('name')
      .trim()
      .isLength({ min: 5, max: 50 })
      .withMessage('Genre name must be between 5 and 50 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      {
        new: true
      }
    );

    if (!genre)
      return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
  }
);

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

module.exports = router;
