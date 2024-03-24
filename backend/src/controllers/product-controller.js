const logger = require('../utils/logger');
const productService = require('../services/product-service');
const {
  validateProductId,
  validateProduct,
} = require('../validators/product-validator');

const getAllProducts = async (req, res) => {
  const { serviceError, serviceValue } = await productService.findAllProducts();

  if (serviceError) {
    return res.status(500).json({ error: 'Erro inesperado' });
  }

  return res.json(serviceValue);
};

const getProductById = async (req, res) => {
  const { error, value } = validateProductId(req.params.id);

  if (error) {
    logger.warn('GET product by id, validation error occurred:', error);
    return res.status(400).json({ errors: error.details });
  }

  const { serviceError, serviceValue } = await productService.findProductById(
    value
  );

  if (serviceError) {
    return res.status(500).json({ error: 'Erro inesperado' });
  }

  return serviceValue
    ? res.json(serviceValue)
    : res.status(404).json({ error: 'Produto não encontrado' });
};

const postProduct = async (req, res) => {
  const { error, value } = validateProduct(req.body);

  if (error) {
    logger.warn('POST product, validation error occurred:', error);
    return res.status(400).json({ errors: error.details });
  }

  const { serviceError, serviceValue } = await productService.addProduct(value);

  if (serviceError) {
    return res.status(500).json({ error: 'Erro inesperado' });
  }

  return res.status(201).json(serviceValue);
};

const putProduct = async (req, res) => {
  const idResult = validateProductId(req.params.id);
  const productResult = validateProduct(req.body);

  if (idResult.error) {
    logger.warn('PUT product, validation error occurred:', idResult.error);
  }

  if (productResult.error) {
    logger.warn('PUT product, validation error occurred:', productResult.error);
  }

  if (idResult.error || productResult.error) {
    return res.status(400).json({
      errors: [
        ...(idResult.error?.details ?? []),
        ...(productResult.error?.details ?? []),
      ],
    });
  }

  const { serviceError, serviceValue } = await productService.updateProduct(
    idResult.value,
    productResult.value
  );

  if (serviceError) {
    return res.status(500).json({ error: 'Erro inesperado' });
  }

  return serviceValue
    ? res.status(204).send()
    : res.status(404).json({ error: 'Produto não encontrado' });
};

const deleteProduct = async (req, res) => {
  const { error, value } = validateProductId(req.params.id);

  if (error) {
    logger.warn('DELETE product, validation error occurred:', error);
    return res.status(400).json({ errors: error.details });
  }

  const { serviceError, serviceValue } = await productService.deleteProduct(
    value
  );

  if (serviceError) {
    return res.status(500).json({ error: 'Erro inesperado' });
  }

  return serviceValue
    ? res.status(204).send()
    : res.status(404).json({ error: 'Produto não encontrado' });
};

module.exports = {
  getAllProducts,
  getProductById,
  postProduct,
  putProduct,
  deleteProduct,
};
