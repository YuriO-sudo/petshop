function createProductController(logger, validator, productService) {
  const getAllProducts = async (req, res) => {
    const { error, value } = await productService.findAllProducts();

    if (error) {
      return res.status(500).json({ error: 'Erro inesperado' });
    }

    return res.json(value);
  };

  const getProductById = async (req, res) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      logger.warn('GET product by id, validation error occurred', errors);
      return res.status(400).json({ errors: errors.array() });
    }

    const { error, value } = await productService.findProductById(
      req.params.id
    );

    if (error) {
      return res.status(500).json({ error: 'Erro inesperado' });
    }

    return value
      ? res.json(value)
      : res.status(404).json({ error: 'Produto não encontrado' });
  };

  const postProduct = async (req, res) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      logger.warn('POST product, validation error occurred', errors);
      return res.status(400).json({ errors: errors.array() });
    }

    const { error, value } = await productService.addProduct(req.body);

    if (error) {
      return res.status(500).json({ error: 'Erro inesperado' });
    }

    return res.status(201).json(value);
  };

  const putProduct = async (req, res) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      logger.warn('PUT product, validation error occurred', errors);
      return res.status(400).json({ errors: errors.array() });
    }

    const { error, value } = await productService.updateProduct(
      req.params.id,
      req.body
    );

    if (error) {
      return res.status(500).json({ error: 'Erro inesperado' });
    }

    return value
      ? res.status(204).send()
      : res.status(404).json({ error: 'Produto não encontrado' });
  };

  const deleteProduct = async (req, res) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      logger.warn('DELETE product, validation error occurred', errors);
      return res.status(400).json({ errors: errors.array() });
    }

    const { error, value } = await productService.deleteProduct(req.params.id);

    if (error) {
      return res.status(500).json({ error: 'Erro inesperado' });
    }

    return value
      ? res.status(204).send()
      : res.status(404).json({ error: 'Produto não encontrado' });
  };

  return {
    getAllProducts,
    getProductById,
    postProduct,
    putProduct,
    deleteProduct,
  };
}

module.exports = createProductController;
