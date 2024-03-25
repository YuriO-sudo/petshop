const logger = require('../utils/logger');
const productRepository = require('../persistence/product-repository');
const unitOfWork = require('../persistence/unit-of-work');

const findAllProducts = async () => {
  try {
    const products = await productRepository.selectAllProducts();
    return { value: products };
  } catch (error) {
    logger.error('Find all products, error occurred:', error);
    return { error };
  }
};

const findProductById = async (productId) => {
  try {
    const product = await productRepository.selectProductById(productId);

    if (!product) {
      logger.warn('Find product by id, product not found', { productId });
    }

    return { value: product };
  } catch (error) {
    logger.error('Find product by id, error occurred:', error);
    return { error };
  }
};

const addProduct = async (product) => {
  try {
    await unitOfWork.beginTransaction();

    const productId = await productRepository.insertProduct(product);
    await productRepository.insertProductDetails(productId, product);

    await unitOfWork.commit();

    return { value: { id: productId, ...product } };
  } catch (error) {
    await unitOfWork.rollback();
    logger.error('Add product, error occurred:', error);
    return { error };
  }
};

const updateProduct = async (productId, product) => {
  try {
    await unitOfWork.beginTransaction();

    const numberOfChanges = await productRepository.updateProduct(
      productId,
      product
    );

    if (numberOfChanges === 0) {
      await unitOfWork.rollback();
      logger.warn('Update product, product not found', { productId });
      return { value: false };
    }

    await productRepository.deleteProductDetails(productId);
    await productRepository.insertProductDetails(productId, product);

    await unitOfWork.commit();

    return { value: true };
  } catch (error) {
    unitOfWork.rollback();
    logger.error('Update product, error occurred:', error);
    return { error };
  }
};

const deleteProduct = async (productId) => {
  try {
    const numberOfChanges = await productRepository.deleteProduct(productId);

    if (numberOfChanges === 0) {
      logger.warn('Delete product, product not found', { productId });
      return { value: false };
    }

    return { value: true };
  } catch (error) {
    logger.error('Delete product, error occurred:', error);
    return { error };
  }
};

module.exports = {
  findAllProducts,
  findProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
