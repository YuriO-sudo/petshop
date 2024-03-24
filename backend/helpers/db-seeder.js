const db = require('../src/persistence/db.js');
const productData = require('./product-data.js');

// Criar tabelas de produtos
function createAndSeedDatabase() {
  return new Promise((resolve) => {
    db.serialize(() => {
      db.run('DROP TABLE IF EXISTS products');
      db.run('DROP TABLE IF EXISTS product_details');

      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        img TEXT NOT NULL,
        description TEXT NOT NULL
      )`);

      db.run(
        `CREATE TABLE IF NOT EXISTS product_details (
        product_id INTEGER NOT NULL,
        price REAL NOT NULL,
        size TEXT NOT NULL,
        FOREIGN KEY(product_id) REFERENCES products(id)
        ON DELETE CASCADE
      );`
      );

      db.run(
        'CREATE INDEX product_details_index ON product_details(product_id)'
      );

      const insertProductStatement = db.prepare(
        'INSERT INTO products (id, name, img, description) VALUES (?, ?, ?, ?)'
      );
      const insertProductDetailStatement = db.prepare(
        'INSERT INTO product_details (product_id, price, size) VALUES (?, ?, ?)'
      );

      for (const product of productData) {
        const { id, name, img, description, prices, sizes } = product;
        insertProductStatement.run([id, name, img, description]);
        //console.log(`Produto '${name}' inserido com sucesso!`);

        for (let i = 0; i < prices.length; i++) {
          insertProductDetailStatement.run(id, prices[i], sizes[i]);
          //console.log(`Detalhe do produto (ID: ${id}) inserido com sucesso!`);
        }
      }

      insertProductStatement.finalize(() => {
        console.log('Database seeded');
        resolve();
      });
    });
  });
}

module.exports = createAndSeedDatabase;
