/**
 * @openapi
 *
 * /products:
 *   get:
 *     summary: Returns all products
 *     tags:
 *       - products
 *     responses:
 *       '200':
 *         description: A JSON array of products
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
 *               type: object
 *               properties:
 *                 error:
 *                    type: string
 *                    example: Erro inesperado
 */

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
 */

/**
 * @openapi
 * tags:
 *   - name: products
 *     description: Everything about products
 */
