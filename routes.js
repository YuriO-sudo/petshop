const produtosJson = require('./produtos.js');

// pra rodar o servidor é só digitar node routes.js no prompt
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const bodyParser = require('body-parser'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Use o body-parser para analisar solicitações JSON
app.use(bodyParser.json());

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('C:\\Users\\ertei\\AppData\\Roaming\\DBeaverData\\workspace6\\.metadata\\sample-database-sqlite-1\\Chinook.db'
,sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {

    if (err) {
        console.error('Erro ao abrir o banco de dados', err.message);
    } else {
        console.log('Conexão com o banco de dados SQLite estabelecida com sucesso');
    }
});

// Criar tabelas de produtos
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT,
        img TEXT,
        description TEXT
      )`
      )

      db.run(
      `CREATE TABLE IF NOT EXISTS product_details (
        product_id INTEGER,
        price REAL,
        sizes TEXT,
        FOREIGN KEY (product_id) REFERENCES products(id)
      );`
      ) 

    //   const stmt = db.prepare('INSERT INTO products (id, name, img, price1, price2, price3, size1, size2, size3, description) VALUES (?,?,?,?,?,?,?,?,?,?)')
      
    
    // usar se necessário
//    produtosJson.forEach(product => stmt.run(
//         product.id,
//         product.name, 
//         product.img,
//         product.price1, 
//         product.price2, 
//         product.price3,
//         product.size1,
//         product.size2,   
//         product.size3,
//         product.description))
//     stmt.finalize();


    // Função para inserir um produto na tabela 'products'
function insertProduct(id, name, img, description) {
    const sql = `INSERT INTO products (id, name, img, description) VALUES (?, ?, ?, ?)`;
    db.run(sql, [id, name, img, description], function(err) {
      if (err) {
        console.error(err.message);
        return;
      }
  
      console.log(`Produto '${name}' inserido com sucesso!`);
    });
  }

  // Função para inserir detalhes do produto na tabela 'product_details'
function insertProductDetails(productId, price, sizes) {
    const sql = `INSERT INTO product_details (product_id, price, sizes) VALUES (?, ?, ?)`;
    db.run(sql, [productId, price, sizes], function(err) {
      if (err) {
        console.error(err.message);
        return;
      }
  
      console.log(`Detalhe do produto (ID: ${productId}) inserido com sucesso!`);
    });
  }


  for (const produto of produtosJson) {
    insertProduct(produto.id, produto.name, produto.img, produto.description);
  
    for (let i = 0; i < produto.price.length; i++) {
      insertProductDetails(produto.id, produto.price[i], produto.sizes[i]);
    }
  }


});

// Rota para listar todos os produtos
app.get('/products', (req, res) => {
    db.all('SELECT p.id, p.name, p.img, p.description, pd.price, pd.sizes FROM products p JOIN product_details pd ON p.id = pd.product_id', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// criar resto das rotas , por enquanto só tem rota /products de listar os produtos

// Rota para adicionar um novo produto
app.post('/newproducts', (req, res) => {
    // const { id, name, img, price1, price2, price3, sizes1, sizes2, sizes3, description } = req.body;
    const { id, name, img, description, price1, price2, price3, sizes1, sizes2, sizes3} = req.body;

    // if (!id || !name || !img || !price1 || !price2 || !price3 || !sizes1 || !sizes2 || !sizes3 || !description) {
        if (!id || !name || !img || !description|| !price1 || !price2 || !price3 || !sizes1 || !sizes2 || !sizes3) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    db.run(sql, [id, name, img, price1, price2, price3, sizes1, sizes2, sizes3, description], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Produto adicionado com sucesso', productId: this.lastID });
    });
});

// Rota para atualizar um produto existente
app.put('/products/:id', (req, res) => {
    const productId = req.params.id; // Captura o ID do produto a ser atualizado
    const { name, img, price1, price2, price3, sizes1, sizes2, sizes3, description } = req.body;

    if (!name || !img || !price1 || !price2 || !price3 || !sizes1 || !sizes2 || !sizes3 || !description) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const sql = `UPDATE products 
                 SET name = ?, img = ?, price1 = ?, price2 = ?, price3 = ?, sizes1 = ?, sizes2 = ?, sizes3 = ?, description = ?
                 WHERE id = ?`;

    db.run(sql, [name, img, price1, price2, price3, sizes1, sizes2, sizes3, description, productId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Produto atualizado com sucesso', productId });
    });
});


// falta implementar um delete aqui 
// Rota para excluir um produto pelo ID
app.delete('/products/:id', (req, res) => {
    const productId = req.params.id;

    // Verifique se o ID do produto é um número válido
    // if (isNaN(productId)) {
    //     return res.status(400).json({ error: 'ID do produto inválido' });
    // }

    // Execute a exclusão do produto no banco de dados
    const sql = `DELETE FROM products WHERE id = ?`;

    db.run(sql, [productId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Verifique se algum produto foi excluído
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        res.status(200).json({ message: 'Produto excluído com sucesso' });
    });
});



// falta integrar o frontend com o backend

// criar no front botão de adicionar novo produto, e ele chama o post pra adicionar no banco

// criar no front botão de excluir produto no banco



// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});
