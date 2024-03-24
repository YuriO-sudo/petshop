const Joi = require('joi');

const productIdSchema = Joi.number().positive().integer().label('id');

const productSchema = Joi.object({
  name: Joi.string().trim().max(150).required(),
  img: Joi.string().trim().uri({ relativeOnly: true }).required(),
  description: Joi.string().trim().max(500).required(),
  prices: Joi.array()
    .items(Joi.number().positive().precision(2))
    .length(3)
    .required(),
  sizes: Joi.array().items(Joi.string().trim().max(50)).length(3).required(),
});

const validateProductId = (productId) => productIdSchema.validate(productId);
const validateProduct = (product) =>
  productSchema.validate(product, { abortEarly: false });

module.exports = { validateProductId, validateProduct };
