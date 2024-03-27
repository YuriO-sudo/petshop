const validator = require('express-validator');

const db = require('../persistence/db');
const logger = require('../utils/logger');

const unitOfWork = require('../persistence/unit-of-work');
const productRepository = require('../persistence/product-repository');
const productService = require('../services/product-service');
const productController = require('../controllers/product-controller');

const uow = unitOfWork(db);
const repository = productRepository(db);
const service = productService(logger, uow, repository);
const controller = productController(logger, validator, service);

module.exports = controller;
