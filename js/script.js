//const produtosJson = require('../produtos');

// aula 05
// criar a variável modalKey sera global
let modalKey = 0;

// variavel para controlar a quantidade inicial de produtoss na modal
let quantprodutoss = 1;

let cart = []; // carrinho
// /aula 05

// funcoes auxiliares ou uteis
const seleciona = (elemento) => document.querySelector(elemento);
const selecionaTodos = (elemento) => document.querySelectorAll(elemento);

// let valor = 0.00

const formatoReal = (valor) => {
  if (valor) {
    return valor.toFixed(2);
  }
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// se essa função for fazer falta eu descomento depois
// const formatoMonetario = (valor) => {
//     if(valor) {
//         return valor.toFixed(2)
//     }
// }

const abrirModal = () => {
  seleciona('.produtosWindowArea').style.opacity = 0; // transparente
  seleciona('.produtosWindowArea').style.display = 'flex';
  setTimeout(() => (seleciona('.produtosWindowArea').style.opacity = 1), 150);
};

const fecharModal = () => {
  seleciona('.produtosWindowArea').style.opacity = 0; // transparente
  setTimeout(
    () => (seleciona('.produtosWindowArea').style.display = 'none'),
    500
  );
};

const botoesFechar = () => {
  // BOTOES FECHAR MODAL
  selecionaTodos(
    '.produtosInfo--cancelButton, .produtosInfo--cancelMobileButton'
  ).forEach((item) => item.addEventListener('click', fecharModal));
};

const preencheDadosDosprodutos = (produtosItem, item, index) => {
  // aula 05
  // setar um atributo para identificar qual elemento foi clicado
  produtosItem.setAttribute('data-key', index);
  produtosItem.querySelector('.produtos-item--img img').src = item.img;
  produtosItem.querySelector('.produtos-item--price').innerHTML = formatoReal(
    item.price[2]
  );
  produtosItem.querySelector('.produtos-item--name').innerHTML = item.name;
  produtosItem.querySelector('.produtos-item--desc').innerHTML =
    item.description;
};

const preencheDadosModal = (item) => {
  seleciona('.produtosBig img').src = item.img;
  seleciona('.produtosInfo h1').innerHTML = item.name;
  seleciona('.produtosInfo--desc').innerHTML = item.description;
  seleciona('.produtosInfo--actualPrice').innerHTML = formatoReal(
    item.price[2]
  );
};

// aula 05
const pegarKey = (e) => {
  // .closest retorna o elemento mais proximo que tem a class que passamos
  // do .produtos-item ele vai pegar o valor do atributo data-key
  let key = e.target.closest('.produtos-item').getAttribute('data-key');
  //console.log('produtos clicada ' + key)
  //console.log(produtosJson[key])

  // garantir que a quantidade inicial de produtoss é 1
  quantprodutoss = 1;

  // Para manter a informação de qual produtos foi clicada
  modalKey = key;

  return key;
};

const preencherTamanhos = (key) => {
  // tirar a selecao de tamanho atual e selecionar o tamanho grande
  seleciona('.produtosInfo--size.selected').classList.remove('selected');

  // selecionar todos os tamanhos
  selecionaTodos('.produtosInfo--size').forEach((size, sizeIndex) => {
    // selecionar o tamanho grande
    sizeIndex == 2 ? size.classList.add('selected') : '';
    size.querySelector('span').innerHTML = produtosJson[key].sizes[sizeIndex];
  });
};

const escolherTamanhoPreco = (key) => {
  // Ações nos botões de tamanho
  // selecionar todos os tamanhos
  selecionaTodos('.produtosInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
      // clicou em um item, tirar a selecao dos outros e marca o q vc clicou
      // tirar a selecao de tamanho atual e selecionar o tamanho grande
      seleciona('.produtosInfo--size.selected').classList.remove('selected');
      // marcar o que vc clicou, ao inves de usar e.target use size, pois ele é nosso item dentro do loop
      size.classList.add('selected');

      // mudar o preço de acordo com o tamanho
      seleciona('.produtosInfo--actualPrice').innerHTML = formatoReal(
        produtosJson[key].price[sizeIndex]
      );
    });
  });
};

const mudarQuantidade = () => {
  // Ações nos botões + e - da janela modal
  seleciona('.produtosInfo--qtmais').addEventListener('click', () => {
    quantprodutoss++;
    seleciona('.produtosInfo--qt').innerHTML = quantprodutoss;
  });

  seleciona('.produtosInfo--qtmenos').addEventListener('click', () => {
    if (quantprodutoss > 1) {
      quantprodutoss--;
      seleciona('.produtosInfo--qt').innerHTML = quantprodutoss;
    }
  });
};
// /aula 05

// aula 06
const adicionarNoCarrinho = () => {
  seleciona('.produtosInfo--addButton').addEventListener('click', () => {
    //console.log('Adicionar no carrinho')

    // pegar dados da janela modal atual
    // qual produtos? pegue o modalKey para usar produtosJson[modalKey]
    //console.log("produtos " + modalKey)
    // tamanho
    let size = seleciona('.produtosInfo--size.selected').getAttribute(
      'data-key'
    );
    //console.log("Tamanho " + size)
    // quantidade
    //console.log("Quant. " + quantprodutoss)
    // preco
    let price = seleciona('.produtosInfo--actualPrice').innerHTML.replace(
      'R$&nbsp;',
      ''
    );

    // Extrai o preço do HTML
    // let priceText = seleciona('.produtosInfo--actualPrice').textContent;

    // Extrai apenas os dígitos do preço usando uma expressão regular
    // let priceMatch = priceText.match(/\d+(\.\d{1,2})?/);

    // Converte o preço para um número decimal com duas casas decimais
    // let price = parseFloat(priceMatch[0]).toFixed(2);

    // crie um identificador que junte id e tamanho
    // concatene as duas informacoes separadas por um símbolo, vc escolhe
    let identificador = produtosJson[modalKey].id + 't' + size;

    // antes de adicionar verifique se ja tem aquele codigo e tamanho
    // para adicionarmos a quantidade
    let key = cart.findIndex((item) => item.identificador == identificador);
    //console.log(key)

    if (key > -1) {
      // se encontrar aumente a quantidade
      cart[key].qt += quantprodutoss;
    } else {
      // adicionar objeto produtos no carrinho
      let produtos = {
        identificador,
        id: produtosJson[modalKey].id,
        size, // size: size
        qt: quantprodutoss,
        price: parseFloat(price).toFixed(2), // price: price
      };
      cart.push(produtos);
      //console.log(produtos)
      //console.log('Sub total R$ ' + (produtos.qt * produtos.price).toFixed(2))
    }

    fecharModal();
    abrirCarrinho();
    atualizarCarrinho();
  });
};

const abrirCarrinho = () => {
  //console.log('Qtd de itens no carrinho ' + cart.length)
  if (cart.length > 0) {
    // mostrar o carrinho
    seleciona('aside').classList.add('show');
    seleciona('header').style.display = 'flex'; // mostrar barra superior
  }

  // exibir aside do carrinho no modo mobile
  seleciona('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
      seleciona('aside').classList.add('show');
      seleciona('aside').style.left = '0';
    }
  });
};

const fecharCarrinho = () => {
  // fechar o carrinho com o botão X no modo mobile
  seleciona('.menu-closer').addEventListener('click', () => {
    seleciona('aside').style.left = '100vw'; // usando 100vw ele ficara fora da tela
    seleciona('header').style.display = 'flex';
  });
};

const atualizarCarrinho = () => {
  // exibir número de itens no carrinho
  seleciona('.menu-openner span').innerHTML = cart.length;

  // mostrar ou nao o carrinho
  if (cart.length > 0) {
    // mostrar o carrinho
    seleciona('aside').classList.add('show');

    // zerar meu .cart para nao fazer insercoes duplicadas
    seleciona('.cart').innerHTML = '';

    // crie as variaveis antes do for
    // subtotal(Number) = 0.00
    let subtotal = 0;
    let desconto = 0.0;
    let total = 0.0;

    // para preencher os itens do carrinho, calcular subtotal
    for (let i in cart) {
      // use o find para pegar o item por id
      let produtosItem = produtosJson.find((item) => item.id == cart[i].id);
      //console.log(produtosItem)

      // em cada item pegar o subtotal
      // mudei aqui
      subtotal += cart[i].price * cart[i].qt;
      // subtotal += (Number(cart[i].price) * Number(cart[i].qt)).toFixed(2);

      //console.log(cart[i].price)
      //console.log('aqui')

      // fazer o clone, exibir na telas e depois preencher as informacoes
      let cartItem = seleciona('.models .cart--item').cloneNode(true);
      seleciona('.cart').append(cartItem);

      let produtosSizeName = cart[i].size;

      let produtosName = `${produtosItem.name} (${produtosSizeName})`;

      // preencher as informacoes
      cartItem.querySelector('img').src = produtosItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = produtosName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

      // selecionar botoes + e -
      cartItem
        .querySelector('.cart--item-qtmais')
        .addEventListener('click', () => {
          // //console.log('Clicou no botão mais')
          // adicionar apenas a quantidade que esta neste contexto
          cart[i].qt++;
          // atualizar a quantidade
          atualizarCarrinho();
        });

      cartItem
        .querySelector('.cart--item-qtmenos')
        .addEventListener('click', () => {
          // //console.log('Clicou no botão menos')
          if (cart[i].qt > 1) {
            // subtrair apenas a quantidade que esta neste contexto
            cart[i].qt--;
          } else {
            // remover se for zero
            cart.splice(i, 1);
          }

          cart.length < 1 ? (seleciona('header').style.display = 'flex') : '';

          // atualizar a quantidade
          atualizarCarrinho();
        });

      seleciona('.cart').append(cartItem);
    } // fim do for

    // fora do for
    // calcule desconto 10% e total
    //desconto = subtotal * 0.1
    desconto = subtotal * 0;
    // mudei aqui tbm
    // total = (subtotal - desconto).toFixed(2)

    total = subtotal - desconto;

    // exibir na tela os resultados
    // selecionar o ultimo span do elemento
    seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal);
    seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto);
    seleciona('.total span:last-child').innerHTML = formatoReal(total);
  } else {
    // ocultar o carrinho
    seleciona('aside').classList.remove('show');
    seleciona('aside').style.left = '100vw';
  }
};

const finalizarCompra = () => {
  seleciona('.cart--finalizar').addEventListener('click', () => {
    //console.log('Finalizar compra')
    seleciona('aside').classList.remove('show');
    seleciona('aside').style.left = '100vw';
    seleciona('header').style.display = 'flex';
  });
};

// /aula 06

// MAPEAR produtosJson para gerar lista de produtoss
produtosJson.map((item, index) => {
  ////console.log(item)
  let produtosItem = document
    .querySelector('.models .produtos-item')
    .cloneNode(true);
  ////console.log(produtosItem)
  //document.querySelector('.produtos-area').append(produtosItem)
  seleciona('.produtos-area').append(produtosItem);

  // preencher os dados de cada produtos
  preencheDadosDosprodutos(produtosItem, item, index);

  // produtos clicada
  produtosItem
    .querySelector('.produtos-item a')
    .addEventListener('click', (e) => {
      e.preventDefault();
      //console.log('Clicou na produtos')

      // aula 05
      let chave = pegarKey(e);
      // /aula 05

      // abrir janela modal
      abrirModal();

      // preenchimento dos dados
      preencheDadosModal(item);

      // aula 05
      // pegar tamanho selecionado
      preencherTamanhos(chave);

      // definir quantidade inicial como 1
      seleciona('.produtosInfo--qt').innerHTML = quantprodutoss;

      // selecionar o tamanho e preco com o clique no botao
      escolherTamanhoPreco(chave);
      // /aula 05
    });

  botoesFechar();
}); // fim do MAPEAR produtosJson para gerar lista de produtoss

// aula 05
// mudar quantidade com os botoes + e -
mudarQuantidade();
// /aula 05

// aula 06
adicionarNoCarrinho();
atualizarCarrinho();
fecharCarrinho();
finalizarCompra();
// /aula 06

fetch('/products', {
  headers: {
    'Cache-Control': 'no-cache',
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error('Não foi possível obter os produtos');
    }
    return response.json();
  })
  .then((produtosJson) => {
    // Manipular os dados recebidos, por exemplo, renderizar os produtos na interface do usuário
    console.log(data);
    console.log(produtosJson);
  })
  .catch((error) => {
    console.error('Erro:', error);
  });

// pra rodar o servidor do front precisa abrir o powershell CTRL + ' aqui no VsCode e digitar http-server
// se quiser especificar a porta pode ser http-server -p 3000 ( na porta 3000 tá rodando o backend)

// rodar esse comando no terminal pra liberar o acesso de execução temporária de scripts
// Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
