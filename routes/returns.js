const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

router.post(
  '/',
  [
    auth,
    body('customerId')
      .trim()
      .not()
      .isEmpty()
      .withMessage('movie ID must be provided'),
    body('movieId')
      .trim()
      .not()
      .isEmpty()
      .withMessage('movie ID must be provided'),
    validateRequest
  ],
  async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if (!rental) return res.status(404).send('Rental not found.');

    if (rental.dateReturned)
      return res.status(400).send('Return already processed.');

    rental.return();
    await rental.save();

    await Movie.updateOne(
      { _id: rental.movie._id },
      {
        $inc: { numberInStock: 1 }
      }
    );

    return res.send(rental);
  }
);

module.exports = router;
