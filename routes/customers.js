const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

const { Customer } = require('../models/customer');

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.post(
  '/',
  [
    body('name')
      .trim()
      .isLength({ min: 5, max: 50 })
      .withMessage('name must be between 5 and 50'),
    body('phone')
      .trim()
      .isLength({ min: 5, max: 50 })
      .withMessage('phone number must be at least 5 numbers'),
    validateRequest
  ],
  async (req, res) => {
    let customer = new Customer({
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
    });
    customer = await customer.save();

    res.send(customer);
  }
);

router.put(
  '/:id',
  [
    body('name')
      .trim()
      .isLength({ min: 5, max: 50 })
      .withMessage('name must be between 5 and 50'),
    body('phone')
      .trim()
      .isLength({ min: 5, max: 50 })
      .withMessage('phone number must be at least 5 numbers'),
    validateRequest
  ],
  async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
      },
      { new: true }
    );

    if (!customer)
      return res
        .status(404)
        .send('The customer with the given ID was not found.');

    res.send(customer);
  }
);

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send('The customer with the given ID was not found.');

  res.send(customer);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send('The customer with the given ID was not found.');

  res.send(customer);
});

module.exports = router;
