const express = require('express');
const bodyParser = require('body-parser');

const requestLoggerMiddleware = require('./middlewares/request-logger');
const productRouter = require('./routes/product-router');

const app = express();

// Use o body-parser para analisar solicitações JSON
app.use(bodyParser.json());
app.use(requestLoggerMiddleware);
app.use(productRouter);

// falta integrar o frontend com o backend

// criar no front botão de adicionar novo produto, e ele chama o post pra adicionar no banco

// criar no front botão de excluir produto no banco

module.exports = app;
