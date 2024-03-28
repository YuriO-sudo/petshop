function createProductRepository(db) {
  const selectAllProducts = () => {
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

    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        rows.forEach((r) => parseProductDetails(r));
        resolve(rows);
      });
    });
  };

  const selectProductById = (productId) => {
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

    return new Promise((resolve, reject) => {
      db.get(sql, [productId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (row) {
          parseProductDetails(row);
        }

        resolve(row);
      });
    });
  };

  const insertProduct = (product) => {
    const sql =
      'INSERT INTO products (name, img, description) VALUES (?, ?, ?)';
    const { name, img, description } = product;

    return new Promise((resolve, reject) => {
      db.run(sql, [name, img, description], function (err) {
        if (err) {
          reject(err);
          return;
        }

        resolve(this.lastID);
      });
    });
  };

  const updateProduct = (productId, product) => {
    const sql = `UPDATE products
    SET name = ?, img = ?, description = ?
    WHERE id = ?`;
    const { name, img, description } = product;

    return new Promise((resolve, reject) => {
      db.run(sql, [name, img, description, productId], function (err) {
        if (err) {
          reject(err);
          return;
        }

        resolve(this.changes);
      });
    });
  };

  const deleteProduct = (productId) => {
    const sql = 'DELETE FROM products WHERE id = ?';

    return new Promise((resolve, reject) => {
      db.run(sql, [productId], function (err) {
        if (err) {
          reject(err);
          return;
        }

        resolve(this.changes);
      });
    });
  };

  const insertProductDetails = (productId, product) => {
    const sql =
      'INSERT INTO product_details (product_id, price, size) VALUES (?, ?, ?)';
    const { prices, sizes } = product;

    return new Promise((resolve, reject) => {
      const statement = db.prepare(sql);
      const errors = [];

      for (let i = 0; i < prices.length; i++) {
        statement.run([productId, prices[i], sizes[i]], (err) => {
          if (err) {
            errors.push(err);
          }
        });
      }

      statement.finalize(() => {
        if (errors.length > 0) {
          reject(errors);
          return;
        }

        resolve();
      });
    });
  };

  const deleteProductDetails = (productId) => {
    const sql = 'DELETE FROM product_details WHERE product_id = ?';

    return new Promise((resolve, reject) => {
      db.run(sql, [productId], (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  };

  return {
    selectAllProducts,
    selectProductById,
    insertProduct,
    updateProduct,
    deleteProduct,
    insertProductDetails,
    deleteProductDetails,
  };
}

const parseProductDetails = (row) => {
  row.prices = JSON.parse(row.prices);
  row.sizes = JSON.parse(row.sizes);
};

module.exports = createProductRepository;
