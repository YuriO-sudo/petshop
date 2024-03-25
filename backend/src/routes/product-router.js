const express = require('express');

const productController = require('../controllers/product-controller');
const {
  createProductIdChain,
  createProductBodyChain,
  createProductIdAndBodyChain,
} = require('../validators/product-validator');

const productRouter = express.Router();

productRouter
  .route('/products')
  .get(productController.getAllProducts)
  .post(createProductBodyChain, productController.postProduct);

productRouter
  .route('/products/:id')
  .get(createProductIdChain, productController.getProductById)
  .put(createProductIdAndBodyChain, productController.putProduct)
  .delete(createProductIdChain, productController.deleteProduct);

module.exports = productRouter;
