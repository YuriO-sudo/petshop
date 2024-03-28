const createProductController = require('../../../src/controllers/product-controller');

const loggerMock = {
  warn: jest.fn(),
};

const validatorMock = {
  validationResult: jest.fn(),
};

const productServiceMock = {
  findAllProducts: jest.fn(),
  findProductById: jest.fn(),
  addProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
};

const productController = createProductController(
  loggerMock,
  validatorMock,
  productServiceMock
);

let req = {};
let res = {};

describe('Product Controller Tests', () => {
  beforeEach(() => {
    req = {};
    res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn();
  });

  test('getAllProducts should return products when successful', async () => {
    const result = { value: [{ name: 'some product' }] };
    productServiceMock.findAllProducts.mockResolvedValue(result);

    await productController.getAllProducts(req, res);

    expect(res.json).toHaveBeenCalledWith(result.value);
  });

  test('getAllProducts should return 500 when error is present', async () => {
    const result = { error: 'some error' };
    const expectedBody = { error: 'Erro inesperado' };
    productServiceMock.findAllProducts.mockResolvedValue(result);

    await productController.getAllProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expectedBody);
  });

  test('getProductById should return product when successful', async () => {
    req.params = { id: 1 };
    const result = { value: { name: 'some product' } };
    validatorMock.validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
    });
    productServiceMock.findProductById.mockResolvedValue(result);

    await productController.getProductById(req, res);

    expect(res.json).toHaveBeenCalledWith(result.value);
  });

  test('getProductById should return 404 when product is not found', async () => {
    req.params = { id: 1 };
    const result = {};
    const expectedBody = { error: 'Produto não encontrado' };
    validatorMock.validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
    });
    productServiceMock.findProductById.mockResolvedValue(result);

    await productController.getProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expectedBody);
  });

  test('getProductById should return 400 when validation error occurs', async () => {
    const errorMock = [{ error: 'some error' }];
    const expectedBody = { errors: errorMock };
    validatorMock.validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(false),
      array: jest.fn().mockReturnValue(errorMock),
    });

    await productController.getProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expectedBody);
  });

  test('getProductById should return 500 when error is present', async () => {
    req.params = { id: 1 };
    const result = { error: 'some error' };
    const expectedBody = { error: 'Erro inesperado' };
    validatorMock.validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
    });
    productServiceMock.findProductById.mockResolvedValue(result);

    await productController.getProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expectedBody);
  });

  test('postProduct should return 201 and product when successful', async () => {
    req.body = { name: 'some product' };
    const result = { value: { id: 1, name: 'some product' } };
    validatorMock.validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
    });
    productServiceMock.addProduct.mockResolvedValue(result);

    await productController.postProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(result.value);
  });

  test('postProduct should return 400 when validation error occurs', async () => {
    const errorMock = [{ error: 'some error' }];
    const expectedBody = { errors: errorMock };
    validatorMock.validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(false),
      array: jest.fn().mockReturnValue(errorMock),
    });

    await productController.postProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expectedBody);
  });

  test('postProduct should return 500 when error is present', async () => {
    req.body = { name: 'some product' };
    const result = { error: 'some error' };
    const expectedBody = { error: 'Erro inesperado' };
    validatorMock.validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
    });
    productServiceMock.addProduct.mockResolvedValue(result);

    await productController.postProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expectedBody);
  });

  test('putProduct should return 204 when successful', async () => {
    req.params = { id: 1 };
    req.body = { name: 'some product' };
    const result = { value: true };
    validatorMock.validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
    });
    productServiceMock.updateProduct.mockResolvedValue(result);

    await productController.putProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  test('putProduct should return 404 when product is not found', async () => {
    req.params = { id: 1 };
    req.body = { name: 'some product' };
    const result = { value: false };
    const expectedBody = { error: 'Produto não encontrado' };
    validatorMock.validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
    });
    productServiceMock.updateProduct.mockResolvedValue(result);

    await productController.putProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expectedBody);
  });

  test('putProduct should return 400 when validation error occurs', async () => {
    const errorMock = [{ error: 'some error' }];
    const expectedBody = { errors: errorMock };
    validatorMock.validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(false),
      array: jest.fn().mockReturnValue(errorMock),
    });

    await productController.putProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expectedBody);
  });

  test('putProduct should return 500 when error is present', async () => {
    req.params = { id: 1 };
    req.body = { name: 'some product' };
    const result = { error: 'some error' };
    const expectedBody = { error: 'Erro inesperado' };
    validatorMock.validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
    });
    productServiceMock.updateProduct.mockResolvedValue(result);

    await productController.putProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expectedBody);
  });

  test('deleteProduct should return 204 when successful', async () => {
    req.params = { id: 1 };
    const result = { value: true };
    validatorMock.validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
    });
    productServiceMock.deleteProduct.mockResolvedValue(result);

    await productController.deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  test('deleteProduct should return 404 when product is not found', async () => {
    req.params = { id: 1 };
    const result = { value: false };
    const expectedBody = { error: 'Produto não encontrado' };
    validatorMock.validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
    });
    productServiceMock.deleteProduct.mockResolvedValue(result);

    await productController.deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expectedBody);
  });

  test('deleteProduct should return 400 when validation error occurs', async () => {
    const errorMock = [{ error: 'some error' }];
    const expectedBody = { errors: errorMock };
    validatorMock.validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(false),
      array: jest.fn().mockReturnValue(errorMock),
    });

    await productController.deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expectedBody);
  });

  test('deleteProduct should return 500 when error is present', async () => {
    req.params = { id: 1 };
    const result = { error: 'some error' };
    const expectedBody = { error: 'Erro inesperado' };
    validatorMock.validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
    });
    productServiceMock.deleteProduct.mockResolvedValue(result);

    await productController.deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expectedBody);
  });
});
