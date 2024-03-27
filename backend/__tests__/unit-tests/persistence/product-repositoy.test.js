const productRepository = require('../../../src/persistence/product-repository');

const dbMock = {
  all: jest.fn(),
  get: jest.fn(),
  run: jest.fn(),
  prepare: jest.fn(),
};

const repository = productRepository(dbMock);

describe('Product Repository Tests', function () {
  this.changes = 0;
  this.lastID = 1;

  test('selectAllProducts should resolve with products when successful', async () => {
    const products = [{ name: 'some product', prices: '[]', sizes: '[]' }];
    dbMock.all.mockImplementation((sql, callback) => callback(null, products));

    await expect(repository.selectAllProducts()).resolves.toEqual(products);
  });

  test('selectAllProducts should reject with error when error occurs', async () => {
    const errorMock = new Error();
    dbMock.all.mockImplementation((sql, callback) => callback(errorMock));

    await expect(repository.selectAllProducts()).rejects.toEqual(errorMock);
  });

  test('selectProductById should resolve with product when successful', async () => {
    const product = { name: 'some product', prices: '[]', sizes: '[]' };
    dbMock.get.mockImplementation((sql, [], callback) =>
      callback(null, product)
    );

    await expect(repository.selectProductById()).resolves.toEqual(product);
  });

  test('selectProductById should reject with error when error occurs', async () => {
    const errorMock = new Error();
    dbMock.get.mockImplementation((sql, [], callback) => callback(errorMock));

    await expect(repository.selectProductById()).rejects.toEqual(errorMock);
  });

  test('insertProduct should resolve with id when successful', async () => {
    const product = {
      name: 'some product',
      img: 'some img',
      description: 'some description',
    };
    dbMock.run.mockImplementation((sql, [], callback) => callback(null));

    await expect(repository.insertProduct(product)).resolves.toEqual(
      this.lastID
    );
  });

  test('insertProduct should reject with error when error occurs', async () => {
    const product = {
      name: 'some product',
      img: 'some img',
      description: 'some description',
    };
    const errorMock = new Error();
    dbMock.run.mockImplementation((sql, [], callback) => callback(errorMock));

    await expect(repository.insertProduct(product)).rejects.toEqual(errorMock);
  });

  test('updateProduct should resolve with changes when successful', async () => {
    const productId = 1;
    const product = {
      name: 'some product',
      img: 'some img',
      description: 'some description',
    };
    dbMock.run.mockImplementation((sql, [], callback) => callback(null));

    await expect(repository.updateProduct(productId, product)).resolves.toEqual(
      this.changes
    );
  });

  test('updateProduct should reject with error when error occurs', async () => {
    const productId = 1;
    const product = {
      name: 'some product',
      img: 'some img',
      description: 'some description',
    };
    const errorMock = new Error();
    dbMock.run.mockImplementation((sql, [], callback) => callback(errorMock));

    await expect(repository.updateProduct(productId, product)).rejects.toEqual(
      errorMock
    );
  });

  test('deleteProduct should resolve with changes when successful', async () => {
    const productId = 1;
    dbMock.run.mockImplementation((sql, [], callback) => callback(null));

    await expect(repository.deleteProduct(productId)).resolves.toEqual(
      this.changes
    );
  });

  test('deleteProduct should reject with error when error occurs', async () => {
    const productId = 1;
    const errorMock = new Error();
    dbMock.run.mockImplementation((sql, [], callback) => callback(errorMock));

    await expect(repository.deleteProduct(productId)).rejects.toEqual(
      errorMock
    );
  });

  test('insertProductDetails should resolve when successful', async () => {
    const productId = 1;
    const product = { name: 'some product', prices: [1], sizes: ['a'] };
    dbMock.prepare.mockReturnValue({
      run: jest.fn().mockImplementation(([], callback) => callback(null)),
      finalize: jest.fn().mockImplementation((callback) => callback()),
    });

    await expect(
      repository.insertProductDetails(productId, product)
    ).resolves.not.toBeDefined();
  });

  test('insertProductDetails should reject with errors when error occurs', async () => {
    const productId = 1;
    const product = { name: 'some product', prices: [1], sizes: ['a'] };
    const errorMock = new Error();
    const expectedResult = [errorMock];
    dbMock.prepare.mockReturnValue({
      run: jest.fn().mockImplementation(([], callback) => callback(errorMock)),
      finalize: jest.fn().mockImplementation((callback) => callback()),
    });

    await expect(
      repository.insertProductDetails(productId, product)
    ).rejects.toEqual(expectedResult);
  });

  test('deleteProductDetails should resolve when successful', async () => {
    const productId = 1;
    dbMock.run.mockImplementation((sql, [], callback) => callback(null));

    await expect(
      repository.deleteProductDetails(productId)
    ).resolves.not.toBeDefined();
  });

  test('deleteProductDetails should reject with error when error occurs', async () => {
    const productId = 1;
    const errorMock = new Error();
    dbMock.run.mockImplementation((sql, [], callback) => callback(errorMock));

    await expect(repository.deleteProductDetails(productId)).rejects.toEqual(
      errorMock
    );
  });
});
