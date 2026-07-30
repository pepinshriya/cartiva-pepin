const { v4: uuidv4 } = require('uuid');
const productRepository = require('../repositories/product.repository');
const { validateProductData, validateUpdateData, validateId } = require('../utils/validator');

const createProduct = async (data) => {
  validateProductData(data);

  const now = new Date().toISOString();
  const product = {
    productId: uuidv4(),
    name: data.name,
    description: data.description,
    category: data.category,
    price: data.price,
    imageUrl: data.imageUrl || '',
    createdAt: now,
    updatedAt: now,
  };

  return await productRepository.create(product);
};

const getProduct = async (productId) => {
  validateId(productId);

  const product = await productRepository.findById(productId);
  if (!product) {
    throw { statusCode: 404, message: 'Product not found' };
  }

  return product;
};

const getAllProducts = async () => {
  return await productRepository.findAll();
};

const updateProduct = async (productId, data) => {
  validateId(productId);
  validateUpdateData(data);

  const existing = await productRepository.findById(productId);
  if (!existing) {
    throw { statusCode: 404, message: 'Product not found' };
  }

  const updates = { ...data, updatedAt: new Date().toISOString() };
  return await productRepository.update(productId, updates);
};

const deleteProduct = async (productId) => {
  validateId(productId);

  const existing = await productRepository.findById(productId);
  if (!existing) {
    throw { statusCode: 404, message: 'Product not found' };
  }

  return await productRepository.remove(productId);
};

module.exports = { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct };
