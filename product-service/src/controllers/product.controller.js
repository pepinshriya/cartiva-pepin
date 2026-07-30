const productService = require('../services/product.service');
const response = require('../utils/response');

const create = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    return response.created(res, product);
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    console.log('GET ALL PRODUCTS CALLED');

    const products = await productService.getAllProducts();

    console.log('PRODUCT RESULT:', products);

    return response.success(res, products);
  } catch (err) {
    console.log('PRODUCT ERROR:', err);

    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const product = await productService.getProduct(req.params.id);
    return response.success(res, product);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    return response.success(res, product);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    return response.success(res, {
      message: 'Product deleted successfully',
      productId: result.productId,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, getById, update, remove };
