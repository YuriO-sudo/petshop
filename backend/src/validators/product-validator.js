const { body, param } = require('express-validator');

const createProductIdChain = [param('id').isInt({ gt: 0 })];

const createProductBodyChain = [
  body('name').isString().trim().notEmpty().isLength({ max: 150 }),
  body('img')
    .isString()
    .trim()
    .notEmpty()
    .isURL({ require_tld: false })
    .isLength({ max: 255 }),
  body('description').isString().trim().notEmpty().isLength({ max: 500 }),
  body('prices').isArray({ min: 3, max: 3 }),
  body('prices.*')
    .isFloat({ gt: 0 })
    .isDecimal({ decimal_digits: '1,2' })
    .toFloat(),
  body('sizes').isArray({ min: 3, max: 3 }),
  body('sizes.*').isString().trim().notEmpty().isLength({ max: 50 }),
];

const createProductIdAndBodyChain = [
  ...createProductIdChain,
  ...createProductBodyChain,
];

module.exports = {
  createProductIdChain,
  createProductBodyChain,
  createProductIdAndBodyChain,
};
