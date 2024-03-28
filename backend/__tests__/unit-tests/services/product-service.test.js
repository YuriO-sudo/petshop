const createProductService = require('../../../src/services/product-service');

const loggerMock = {
  error: jest.fn(),
  warn: jest.fn(),
};

const unitOfWorkMock = {
  beginTransaction: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
};

const productRepositoryMock = {
  selectAllProducts: jest.fn(),
  selectProductById: jest.fn(),
  insertProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  insertProductDetails: jest.fn(),
  deleteProductDetails: jest.fn(),
};

const productService = createProductService(
  loggerMock,
  unitOfWorkMock,
  productRepositoryMock
);

describe('Product Service Tests', () => {
  test('findAllProducts should not return error and return products when successful', async () => {
    const products = [{ name: 'some product' }];
    productRepositoryMock.selectAllProducts.mockResolvedValue(products);

    const { error, value } = await productService.findAllProducts();

    expect(error).not.toBeDefined();
    expect(value).toEqual(products);
  });

  test('findAllProducts should return error when error is thrown', async () => {
    const errorMock = new Error();
    productRepositoryMock.selectAllProducts.mockRejectedValue(errorMock);

    const { error } = await productService.findAllProducts();

    expect(error).toBe(errorMock);
  });

  test('findProductById should not return error and return product when successful', async () => {
    const productId = 1;
    const product = { name: 'some product' };
    productRepositoryMock.selectProductById.mockResolvedValue(product);

    const { error, value } = await productService.findProductById(productId);

    expect(productRepositoryMock.selectProductById).toHaveBeenCalledWith(
      productId
    );
    expect(error).not.toBeDefined();
    expect(value).toEqual(product);
  });

  test('findProductById should not return error, and not return product when product is not found', async () => {
    const productId = 1;
    productRepositoryMock.selectProductById.mockResolvedValue();

    const { error, value } = await productService.findProductById(productId);

    expect(productRepositoryMock.selectProductById).toHaveBeenCalledWith(
      productId
    );
    expect(error).not.toBeDefined();
    expect(value).not.toBeDefined();
  });

  test('findProductById should return error when error is thrown', async () => {
    const productId = 1;
    const errorMock = new Error();
    productRepositoryMock.selectProductById.mockRejectedValue(errorMock);

    const { error } = await productService.findProductById(productId);

    expect(error).toBe(errorMock);
  });

  test('addProduct should commit transaction, not return error and return added product when successful', async () => {
    const productId = 1;
    const product = { name: 'some product' };
    const expectedValue = { id: productId, ...product };
    productRepositoryMock.insertProduct.mockResolvedValue(productId);

    const { error, value } = await productService.addProduct(product);

    expect(unitOfWorkMock.beginTransaction).toHaveBeenCalled();
    expect(productRepositoryMock.insertProduct).toHaveBeenCalledWith(product);
    expect(productRepositoryMock.insertProductDetails).toHaveBeenCalledWith(
      productId,
      product
    );
    expect(unitOfWorkMock.commit).toHaveBeenCalled();
    expect(error).not.toBeDefined();
    expect(value).toEqual(expectedValue);
  });

  test('addProduct should rollback transaction and return error when error is thrown', async () => {
    const product = { name: 'some product' };
    const errorMock = new Error();
    productRepositoryMock.insertProduct.mockRejectedValue(errorMock);

    const { error } = await productService.addProduct(product);

    expect(unitOfWorkMock.rollback).toHaveBeenCalled();
    expect(error).toBe(errorMock);
  });

  test('updateProduct should commit transaction, not return error and return true when successful', async () => {
    const productId = 1;
    const product = { name: 'some product' };
    const numberOfChanges = 1;
    const expectedValue = true;
    productRepositoryMock.updateProduct.mockResolvedValue(numberOfChanges);

    const { error, value } = await productService.updateProduct(
      productId,
      product
    );

    expect(unitOfWorkMock.beginTransaction).toHaveBeenCalled();
    expect(productRepositoryMock.updateProduct).toHaveBeenCalledWith(
      productId,
      product
    );
    expect(productRepositoryMock.deleteProductDetails).toHaveBeenCalledWith(
      productId
    );
    expect(productRepositoryMock.insertProductDetails).toHaveBeenCalledWith(
      productId,
      product
    );
    expect(unitOfWorkMock.commit).toHaveBeenCalled();
    expect(error).not.toBeDefined();
    expect(value).toEqual(expectedValue);
  });

  test('updateProduct should rollback transaction, not return error and return false when product is not updated', async () => {
    const productId = 1;
    const product = { name: 'some product' };
    const numberOfChanges = 0;
    const expectedValue = false;
    productRepositoryMock.updateProduct.mockResolvedValue(numberOfChanges);

    const { error, value } = await productService.updateProduct(
      productId,
      product
    );

    expect(productRepositoryMock.updateProduct).toHaveBeenCalledWith(
      productId,
      product
    );
    expect(unitOfWorkMock.rollback).toHaveBeenCalled();
    expect(error).not.toBeDefined();
    expect(value).toEqual(expectedValue);
  });

  test('updateProduct should rollback transaction and return error when error is thrown', async () => {
    const productId = 1;
    const product = { name: 'some product' };
    const errorMock = new Error();
    productRepositoryMock.updateProduct.mockRejectedValue(errorMock);

    const { error } = await productService.updateProduct(productId, product);

    expect(unitOfWorkMock.rollback).toHaveBeenCalled();
    expect(error).toBe(errorMock);
  });

  test('deleteProduct should not return error and return true when successful', async () => {
    const productId = 1;
    const numberOfChanges = 1;
    const expectedValue = true;
    productRepositoryMock.deleteProduct.mockResolvedValue(numberOfChanges);

    const { error, value } = await productService.deleteProduct(productId);

    expect(productRepositoryMock.deleteProduct).toHaveBeenCalledWith(productId);
    expect(error).not.toBeDefined();
    expect(value).toBe(expectedValue);
  });

  test('deleteProduct should not return error and return false when product is not deleted', async () => {
    const productId = 1;
    const numberOfChanges = 0;
    const expectedValue = false;
    productRepositoryMock.deleteProduct.mockResolvedValue(numberOfChanges);

    const { error, value } = await productService.deleteProduct(productId);

    expect(productRepositoryMock.deleteProduct).toHaveBeenCalledWith(productId);
    expect(error).not.toBeDefined();
    expect(value).toBe(expectedValue);
  });

  test('deleteProduct should return error when error is thrown', async () => {
    const productId = 1;
    const errorMock = new Error();
    productRepositoryMock.deleteProduct.mockRejectedValue(errorMock);

    const { error } = await productService.deleteProduct(productId);

    expect(error).toBe(errorMock);
  });
});
