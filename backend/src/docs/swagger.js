const swaggerJsdoc = require('swagger-jsdoc');

const swaggerJsdocOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Petshop API',
      description: 'Petshop store API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerJsdocOptions);

const swaggerUiOptions = {
  swaggerOptions: {
    url: '/api-docs/swagger.json',
  },
};

module.exports = { swaggerSpec, swaggerUiOptions };
