const validator = require('express-validator');

const db = require('../persistence/db');
const logger = require('../utils/logger');

const createUnitOfWork = require('../persistence/unit-of-work');
const createProductRepository = require('../persistence/product-repository');
const createProductService = require('../services/product-service');
const createProductController = require('../controllers/product-controller');

const unitOfWork = createUnitOfWork(db);
const productRepository = createProductRepository(db);
const productService = createProductService(
  logger,
  unitOfWork,
  productRepository
);
const productController = createProductController(
  logger,
  validator,
  productService
);

module.exports = productController;
