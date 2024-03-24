const express = require('express');

const productController = require('../controllers/product-controller');

const productRouter = express.Router();

productRouter
  .route('/products')
  .get(productController.getAllProducts)
  .post(productController.postProduct);

productRouter
  .route('/products/:id')
  .get(productController.getProductById)
  .put(productController.putProduct)
  .delete(productController.deleteProduct);

module.exports = productRouter;
