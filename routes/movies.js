const express = require('express');
const router = express.Router();

const { Movie } = require('../models/movie');
const { Genre } = require('../models/genre');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('name');
  res.send(movies);
});

router.post(
  '/',
  [
    body('title').trim().isLength({ min: 5, max: 255 }),
    body('numberInStock').isLength({ min: 0, max: 255 }),
    body('dailyRentalRate').isLength({ min: 0, max: 255 }),
    validateRequest
  ],
  async (req, res) => {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    });
    await movie.save();

    res.send(movie);
  }
);

router.put(
  '/:id',
  [
    body('title').trim().isLength({ min: 5, max: 255 }),
    body('numberInStock').isLength({ min: 0, max: 255 }),
    body('dailyRentalRate').isLength({ min: 0, max: 255 }),
    validateRequest
  ],
  async (req, res) => {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
      },
      { new: true }
    );

    if (!movie)
      return res.status(404).send('The movie with the given ID was not found.');

    res.send(movie);
  }
);

router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie)
    return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie)
    return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});

module.exports = router;
