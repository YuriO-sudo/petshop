const logger = require('../utils/logger');
const productRepository = require('../persistence/product-repository');
const unitOfWork = require('../persistence/unit-of-work');

const findAllProducts = async () => {
  try {
    const products = await productRepository.selectAllProducts();
    return { serviceValue: products };
  } catch (serviceError) {
    logger.error('Find all products, error occurred:', serviceError);
    return { serviceError };
  }
};

const findProduct = async (productId) => {
  try {
    const product = await productRepository.selectProductById(productId);

    if (!product) {
      logger.warn('Find product by id, product not found', { productId });
    }

    return { serviceValue: product };
  } catch (serviceError) {
    logger.error('Find product by id, error occurred:', serviceError);
    return { serviceError };
  }
};

const addProduct = async (product) => {
  try {
    await unitOfWork.beginTransaction();

    const productId = await productRepository.insertProduct(product);
    await productRepository.insertProductDetails(productId, product);

    await unitOfWork.commit();

    return { serviceValue: { id: productId, ...product } };
  } catch (serviceError) {
    await unitOfWork.rollback();
    logger.error('Add product, error occurred:', serviceError);
    return { serviceError };
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
      return { serviceValue: false };
    }

    await productRepository.deleteProductDetails(productId);
    await productRepository.insertProductDetails(productId, product);

    await unitOfWork.commit();

    return { serviceValue: true };
  } catch (serviceError) {
    unitOfWork.rollback();
    logger.error('Update product, error occurred:', serviceError);
    return { serviceError };
  }
};

const deleteProduct = async (productId) => {
  try {
    const numberOfChanges = await productRepository.deleteProduct(productId);

    if (numberOfChanges === 0) {
      logger.warn('Delete product, product not found', { productId });
      return { serviceValue: false };
    }

    return { serviceValue: true };
  } catch (serviceError) {
    logger.error('Delete product, error occurred:', serviceError);
    return { serviceError };
  }
};

module.exports = {
  findAllProducts,
  findProductById: findProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
