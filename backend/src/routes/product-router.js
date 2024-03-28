const express = require('express');

const validators = require('../validators/product-validator');
const productController = require('../ioc/product-dependencies');

const productRouter = express.Router();

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     responses:
 *       '200':
 *         description: An array of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       '500':
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     requestBody:
 *       description: The product to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductForManipulation'
 *     responses:
 *       '201':
 *         description: The created product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrors'
 *       '500':
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
productRouter
  .route('/products')
  .get(productController.getAllProducts)
  .post(validators.productBodyChain, productController.postProduct);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get a product by id
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: The product id
 *     responses:
 *       '200':
 *         description: The requested product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrors'
 *       '404':
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update a product by replacing all its values
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: The product id
 *     requestBody:
 *       description: The replacement product
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductForManipulation'
 *     responses:
 *       '204':
 *         description: Update successful
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrors'
 *       '404':
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: The product id
 *     responses:
 *       '204':
 *         description: Delete successful
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrors'
 *       '404':
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
productRouter
  .route('/products/:id')
  .get(validators.productIdChain, productController.getProductById)
  .put(validators.productIdAndBodyChain, productController.putProduct)
  .delete(validators.productIdChain, productController.deleteProduct);

module.exports = productRouter;

/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *          id:
 *            type: integer
 *            example: 1
 *          name:
 *            type: string
 *            example: Areia de Gato Grãos Finos
 *          img:
 *            type: string
 *            example: images/areiadegato.png
 *          description:
 *            type: string
 *            example: Areia Higiênica Viva Verde Grãos Finos para Gatos
 *          prices:
 *            type: array
 *            items:
 *              type: number
 *              example: 30.5
 *            minItems: 3
 *            maxItems: 3
 *          sizes:
 *            type: array
 *            items:
 *              type: string
 *              example: 1 kg
 *            minItems: 3
 *            maxItems: 3
 *       required:
 *         - id
 *         - name
 *         - img
 *         - description
 *         - prices
 *         - sizes
 *     ProductForManipulation:
 *       type: object
 *       properties:
 *          name:
 *            type: string
 *            example: Areia de Gato Grãos Finos
 *          img:
 *            type: string
 *            example: images/areiadegato.png
 *          description:
 *            type: string
 *            example: Areia Higiênica Viva Verde Grãos Finos para Gatos
 *          prices:
 *            type: array
 *            items:
 *              type: number
 *              example: 30.5
 *            minItems: 3
 *            maxItems: 3
 *          sizes:
 *            type: array
 *            items:
 *              type: string
 *              example: 1 kg
 *            minItems: 3
 *            maxItems: 3
 *       required:
 *         - name
 *         - img
 *         - description
 *         - prices
 *         - sizes
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Um erro ocorreu
 *       required:
 *         - error
 *     ValidationErrors:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ValidationError'
 *       required:
 *         - errors
 *     ValidationError:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           example: field
 *         value:
 *           nullable: true
 *         msg:
 *           type: string
 *           example: Invalid value
 *         path:
 *           type: string
 *           example: id
 *         location:
 *           type: string
 *           example: params
 *       required:
 *         - type
 *         - value
 *         - msg
 *         - path
 *         - location
 */

/**
 * @openapi
 * tags:
 *   - name: Products
 *     description: Everything about products
 */
