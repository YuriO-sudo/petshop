const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');

const requestLoggerMiddleware = require('./middlewares/request-logger');
const productRouter = require('./routes/product-router');
const { swaggerSpec, swaggerUiOptions } = require('./docs/swagger');

const app = express();

// Use o body-parser para analisar solicitações JSON
app.use(bodyParser.json());
app.use(requestLoggerMiddleware);
app.use(productRouter);

app.get('/api-docs/swagger.json', (req, res) => res.json(swaggerSpec));
app.use(
  '/api-docs',
  swaggerUi.serveFiles(null, swaggerUiOptions),
  swaggerUi.setup(null, swaggerUiOptions)
);

// falta integrar o frontend com o backend

// criar no front botão de adicionar novo produto, e ele chama o post pra adicionar no banco

// criar no front botão de excluir produto no banco

module.exports = app;
