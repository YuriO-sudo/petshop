const request = require('supertest');
const productData = require('../helpers/product-data');

process.env.DB = ':memory:';

const app = require('../src/app');
const seedDatabase = require('../helpers/db-seeder');

const agent = request(app);

describe('Products CRUD tests', () => {
  beforeEach(async () => {
    await seedDatabase();
  });

  it('GET all products should return all products', async () => {
    const response = await agent.get('/products');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(productData.length);
  });

  it('GET single product with valid id should return product', async () => {
    const productId = 1;
    const expectedProduct = productData[0];

    const response = await agent.get(`/products/${productId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedProduct);
  });

  it('GET single product with invalid id should return validation error', async () => {
    const invalidId = 'a';
    const expectedString = 'id';

    const response = await agent.get(`/products/${invalidId}`);

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(1);
  });

  it('GET single product with non-existent id should return not found', async () => {
    const nonExistentId = 999;

    const response = await agent.get(`/products/${nonExistentId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Produto não encontrado');
  });

  it('POST with valid product should be added and returned', async () => {
    const productToPost = {
      name: 'test product',
      img: 'images/test-product.png',
      description: 'test product',
      prices: [1.0, 2.0, 3.0],
      sizes: ['1 kg', '2 kg', '3 kg'],
    };

    const response = await agent.post('/products').send(productToPost);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeGreaterThan(0);
    expect(response.body.name).toBe(productToPost.name);
    expect(response.body.img).toBe(productToPost.img);
    expect(response.body.description).toBe(productToPost.description);
    expect(response.body.prices).toEqual(productToPost.prices);
    expect(response.body.sizes).toEqual(productToPost.sizes);
  });

  it('POST with invalid product should return validation error', async () => {
    const productToPost = {};

    const response = await agent.post('/products').send(productToPost);

    expect(response.status).toBe(400);
    expect(response.body.errors.length).toBeGreaterThan(1);
  });

  it('PUT with valid product should be updated', async () => {
    const productId = 1;
    const productForUpdate = {
      name: 'test product',
      img: 'images/test-product.png',
      description: 'test product',
      prices: [1.0, 2.0, 3.0],
      sizes: ['1 kg', '2 kg', '3 kg'],
    };

    const response = await agent
      .put(`/products/${productId}`)
      .send(productForUpdate);

    expect(response.status).toBe(204);
  });

  it('PUT with invalid id should return validation error', async () => {
    const invalidId = 'a';
    const productForUpdate = {
      name: 'test product',
      img: 'images/test-product.png',
      description: 'test product',
      prices: [1.0, 2.0, 3.0],
      sizes: ['1 kg', '2 kg', '3 kg'],
    };

    const response = await agent
      .put(`/products/${invalidId}`)
      .send(productForUpdate);

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(1);
  });

  it('PUT with invalid product should return validation error', async () => {
    const invalidId = 1;
    const invalidProductForUpdate = {};

    const response = await agent
      .put(`/products/${invalidId}`)
      .send(invalidProductForUpdate);

    expect(response.status).toBe(400);
    expect(response.body.errors.length).toBeGreaterThan(1);
  });

  it('PUT with non-existent id should return not found', async () => {
    const nonExistentId = 999;
    const productForUpdate = {
      name: 'test product',
      img: 'images/test-product.png',
      description: 'test product',
      prices: [1.0, 2.0, 3.0],
      sizes: ['1 kg', '2 kg', '3 kg'],
    };

    const response = await agent
      .put(`/products/${nonExistentId}`)
      .send(productForUpdate);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Produto não encontrado');
  });

  it('DELETE product with valid id should be deleted', async () => {
    const productId = 1;

    const response = await agent.delete(`/products/${productId}`);

    expect(response.status).toBe(204);
  });

  it('DELETE product with invalid id should return validation error', async () => {
    const invalidId = 'a';

    const response = await agent.delete(`/products/${invalidId}`);

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(1);
  });

  it('DELETE product with non-existent id should return not found', async () => {
    const nonExistentId = 999;

    const response = await agent.delete(`/products/${nonExistentId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Produto não encontrado');
  });
});
