const produtosJson = require('./produtos.js');

const sqlite3 = require('sqlite3').verbose();

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('petshop.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados', err.message);
  } else {
    console.log('Conexão com o banco de dados SQLite estabelecida com sucesso');
  }
});

// Criar tabelas de produtos
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        img TEXT,
        description TEXT
      )`);

  db.run(
    `CREATE TABLE IF NOT EXISTS product_details (
        product_id INTEGER,
        price REAL,
        size TEXT,
        FOREIGN KEY(product_id) REFERENCES products(id)
        ON DELETE CASCADE
      );`
  );

  db.run(
    `CREATE INDEX product_details_index
    ON product_details(product_id)`
  );

  // Função para inserir um produto na tabela 'products'
  function insertProduct(id, name, img, description) {
    const sql = `INSERT INTO products (id, name, img, description) VALUES (?, ?, ?, ?)`;
    db.run(sql, [id, name, img, description], function (err) {
      if (err) {
        console.error(err.message);
        return;
      }

      console.log(`Produto '${name}' inserido com sucesso!`);
    });
  }

  // Função para inserir detalhes do produto na tabela 'product_details'
  function insertProductDetails(productId, price, size) {
    const sql = `INSERT INTO product_details (product_id, price, size) VALUES (?, ?, ?)`;
    db.run(sql, [productId, price, size], function (err) {
      if (err) {
        console.error(err.message);
        return;
      }

      console.log(`Detalhe do produto (ID: ${productId}) inserido com sucesso!`);
    });
  }

  for (const produto of produtosJson) {
    insertProduct(produto.id, produto.name, produto.img, produto.description);

    for (let i = 0; i < produto.prices.length; i++) {
      insertProductDetails(produto.id, produto.prices[i], produto.sizes[i]);
    }
  }
});
