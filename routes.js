// pra rodar o servidor é só digitar node routes.js no prompt
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const winston = require('winston');
const morgan = require('morgan');

const bodyParser = require('body-parser');
const { validateProductId, validateProduct } = require('./validators');

const app = express();
const PORT = process.env.PORT || 3000;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'http',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
  exceptionHandlers: [new winston.transports.Console()],
  rejectionHandlers: [new winston.transports.Console()],
});

const morganMiddleware = morgan(
  function (tokens, req, res) {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseFloat(tokens.status(req, res)),
      content_length: tokens.res(req, res, 'content-length'),
      response_time: Number.parseFloat(tokens['response-time'](req, res)),
    });
  },
  {
    stream: {
      write: (message) => {
        const data = JSON.parse(message);
        logger.http(`incoming-request`, data);
      },
    },
  }
);

// Use o body-parser para analisar solicitações JSON
app.use(bodyParser.json());
app.use(morganMiddleware);

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('petshop.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    logger.error('Erro ao abrir o banco de dados', err);
  } else {
    logger.info('Conexão com o banco de dados SQLite estabelecida com sucesso');
  }
});

db.get('PRAGMA foreign_keys = ON');

// Rota para listar todos os produtos
app.get('/products', (req, res) => {
  const sql = `SELECT
      p.id,
      p.name,
      p.img,
      p.description,
      json_group_array(pd.price) prices,
      json_group_array(pd.size) sizes
    FROM products p
    LEFT JOIN product_details pd ON p.id = pd.product_id
    GROUP BY p.id`;

  db.all(sql, (err, rows) => {
    if (err) {
      logger.error('GET all products, a db error has occurred:', err);
      return res.status(500).json({ error: 'Erro inesperado' });
    }

    rows.forEach((r) => {
      r.prices = JSON.parse(r.prices);
      r.sizes = JSON.parse(r.sizes);
    });

    return res.json(rows);
  });
});

app.get('/products/:id', (req, res) => {
  const { error, value } = validateProductId(req.params.id);

  if (error) {
    logger.warn('GET single product, a validation error has occurred:', error);
    return res.status(400).json({ errors: error.details });
  }

  const productId = value;
  const sql = `SELECT 
      p.id, 
      p.name, 
      p.img, 
      p.description,
      json_group_array(pd.price) prices,
      json_group_array(pd.size) sizes
    FROM products p
    LEFT JOIN product_details pd ON p.id = pd.product_id
    WHERE p.id = ?
    GROUP BY p.id`;

  db.get(sql, [productId], (err, row) => {
    if (err) {
      logger.error('GET single products, a db error has occurred:', err);
      return res.status(500).json({ error: 'Erro inesperado' });
    }

    if (!row) {
      logger.warn('GET single product, product not found', { productId });
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    row.prices = JSON.parse(row.prices);
    row.sizes = JSON.parse(row.sizes);

    return res.json(row);
  });
});

// Rota para adicionar um novo produto
app.post('/products', (req, res) => {
  const { error, value } = validateProduct(req.body);

  if (error) {
    logger.warn('POST product, a validation error has occurred:', error);
    return res.status(400).json({ errors: error.details });
  }

  const { name, img, description, prices, sizes } = value;

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    const sql = `INSERT INTO products (name, img, description) VALUES (?, ?, ?)`;

    db.run(sql, [name, img, description], function (err) {
      if (err) {
        db.run('ROLLBACK');
        logger.error('POST product, insert product, a db error has occurred:', err);
        return res.status(500).json({ error: 'Erro inesperado' });
      }

      const statement = db.prepare(`INSERT INTO product_details (product_id, price, size) VALUES (?, ?, ?)`);
      const productId = this.lastID;
      const errors = [];

      for (let i = 0; i < 3; i++) {
        statement.run([productId, prices[i], sizes[i]], (err) => {
          if (err) {
            errors.push(err);
            logger.error('POST product, insert product details, a db error has occurred', err);
          }
        });
      }

      statement.finalize(() => {
        if (errors.length > 0) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Erro inesperado' });
        }

        db.run('COMMIT');
        return res.status(201).json({ id: productId, name, img, description, prices, sizes });
      });
    });
  });
});

// Rota para atualizar um produto existente
app.put('/products/:id', (req, res) => {
  const idValidationResult = validateProductId(req.params.id);
  const productValidationResult = validateProduct(req.body);

  if (idValidationResult.error || productValidationResult.error) {
    if (idValidationResult.error) {
      logger.warn('PUT product, a validation error has occurred:', idValidationResult.error);
    }

    if (productValidationResult.error) {
      logger.warn('PUT product, a validation error has occurred:', productValidationResult.error);
    }

    const idValidationErrors = idValidationResult.error?.details ?? [];
    const productValidationErrors = productValidationResult.error?.details ?? [];
    return res.status(400).json({ errors: [...idValidationErrors, ...productValidationErrors] });
  }

  const productId = idValidationResult.value;
  const { name, img, description, prices, sizes } = productValidationResult.value;

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    const updateSql = `UPDATE products
      SET name = ?, img = ?, description = ?
      WHERE id = ?`;

    db.run(updateSql, [name, img, description, productId], function (err) {
      if (err) {
        db.run('ROLLBACK');
        logger.error('PUT product, update product, a db error has occurred:', err);
        return res.status(500).json({ error: 'Erro inesperado' });
      }

      if (this.changes === 0) {
        db.run('ROLLBACK');
        logger.warn('PUT product, product not found', { productId });
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      const deleteSql = 'DELETE FROM product_details WHERE product_id = ?';

      db.run(deleteSql, [productId], function (err) {
        if (err) {
          db.run('ROLLBACK');
          logger.error('PUT product, delete product details, a db error has occurred:', err);
          return res.status(500).json({ error: 'Erro inesperado' });
        }

        const statement = db.prepare(`INSERT INTO product_details (product_id, price, size) VALUES (?, ?, ?)`);
        const errors = [];

        for (let i = 0; i < 3; i++) {
          statement.run([productId, prices[i], sizes[i]], (err) => {
            if (err) {
              errors.push(err);
              logger.error('PUT product, insert product details, a db error has occurred:', err);
            }
          });
        }

        statement.finalize(() => {
          if (errors.length > 0) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Erro inesperado' });
          }

          db.run('COMMIT');
          return res.status(204).send();
        });
      });
    });
  });
});

// Rota para excluir um produto pelo ID
app.delete('/products/:id', (req, res) => {
  const { error, value } = validateProductId(req.params.id);

  if (error) {
    logger.warn('DELETE product, a validation error has occurred:', error);
    return res.status(400).json({ errors: error.details });
  }

  const productId = value;
  const sql = 'DELETE FROM products WHERE id = ?';

  db.run(sql, [productId], function (err) {
    if (err) {
      logger.error('DELETE product, a db error has occurred:', err);
      return res.status(500).json({ error: 'Erro inesperado' });
    }

    if (this.changes === 0) {
      logger.warn('DELETE produtct, product not found', { productId });
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    return res.status(204).send();
  });
});

// falta integrar o frontend com o backend

// criar no front botão de adicionar novo produto, e ele chama o post pra adicionar no banco

// criar no front botão de excluir produto no banco

// Iniciar o servidor
app.listen(PORT, () => {
  logger.info(`Servidor iniciado na porta ${PORT}`);
});
