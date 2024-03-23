// pra rodar o servidor é só digitar node routes.js no prompt
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Use o body-parser para analisar solicitações JSON
app.use(bodyParser.json());

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('petshop.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados', err.message);
  } else {
    console.log('Conexão com o banco de dados SQLite estabelecida com sucesso');
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
      // Add logging
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
  const productId = req.params.id;
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
      // Add logging
      return res.status(500).json({ error: 'Erro inesperado' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    row.prices = JSON.parse(row.prices);
    row.sizes = JSON.parse(row.sizes);

    return res.json(row);
  });
});

// criar resto das rotas , por enquanto só tem rota /products de listar os produtos

// Rota para adicionar um novo produto
app.post('/products', (req, res) => {
  const { name, img, description, prices, sizes } = req.body;

  if (!name || !img || !description || prices?.length != 3 || sizes?.length != 3) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    const sql = `INSERT INTO products (name, img, description) VALUES (?, ?, ?)`;

    db.run(sql, [name, img, description], function (err) {
      if (err) {
        db.run('ROLLBACK');
        // Add logging
        return res.status(500).json({ error: 'Erro inesperado' });
      }

      const statement = db.prepare(`INSERT INTO product_details (product_id, price, size) VALUES (?, ?, ?)`);
      const productId = this.lastID;
      const errors = [];

      for (let i = 0; i < 3; i++) {
        statement.run([productId, prices[i], sizes[i]], (err) => {
          if (err) {
            errors.push(err);
          }
        });
      }

      statement.finalize(() => {
        if (errors.length > 0) {
          db.run('ROLLBACK');
          // Add logging
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
  const productId = req.params.id;
  const { name, img, description, prices, sizes } = req.body;

  if (!name || !img || !description || prices?.length != 3 || sizes?.length != 3) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    const updateSql = `UPDATE products
      SET name = ?, img = ?, description = ?
      WHERE id = ?`;

    db.run(updateSql, [name, img, description, productId], function (err) {
      if (err) {
        db.run('ROLLBACK');
        // Add logging
        return res.status(500).json({ error: 'Erro inesperado' });
      }

      if (this.changes === 0) {
        db.run('ROLLBACK');
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      const deleteSql = 'DELETE FROM product_details WHERE product_id = ?';

      db.run(deleteSql, [productId], function (err) {
        if (err) {
          db.run('ROLLBACK');
          // Add logging
          return res.status(500).json({ error: 'Erro inesperado' });
        }

        const statement = db.prepare(`INSERT INTO product_details (product_id, price, size) VALUES (?, ?, ?)`);
        const errors = [];

        for (let i = 0; i < 3; i++) {
          statement.run([productId, prices[i], sizes[i]], (err) => {
            if (err) {
              errors.push(err);
            }
          });
        }

        statement.finalize(() => {
          if (errors.length > 0) {
            db.run('ROLLBACK');
            // Add logging
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
  const productId = req.params.id;

  const sql = 'DELETE FROM products WHERE id = ?';

  db.run(sql, [productId], function (err) {
    if (err) {
      // Add logging
      return res.status(500).json({ error: 'Erro inesperado' });
    }

    if (this.changes === 0) {
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
  console.log(`Servidor iniciado na porta ${PORT}`);
});
