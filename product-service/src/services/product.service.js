const { v4: uuidv4 } = require('uuid');
const productRepository = require('../repositories/product.repository');
const { validateProductData, validateUpdateData, validateId } = require('../utils/validator');
const { publishProductCreated } = require('../events/product.publisher');
const { createInventory } = require('../clients/inventory.client');

const createProduct = async (data, authHeader) => {
  validateProductData(data);

  const initialStock =
    data.initialStock !== undefined
      ? Number(data.initialStock)
      : data.stock !== undefined
        ? Number(data.stock)
        : 0;

  if (isNaN(initialStock) || initialStock < 0) {
    throw { statusCode: 400, message: 'initialStock must be a non-negative number' };
  }

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

  const createdProduct = await productRepository.create(product);

  try {
    await createInventory(
      {
        productId: createdProduct.productId,
        currentStock: initialStock,
        reservedStock: 0,
        threshold: 10,
      },
      authHeader
    );
  } catch (error) {
    throw {
      statusCode: 502,
      message:
        'Product created successfully, but inventory initialization failed: ' + error.message,
    };
  }

  // await publishProductCreated(createdProduct, initialStock);

  return createdProduct;
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
