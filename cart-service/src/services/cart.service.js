const cartRepository = require('../repositories/cart.repository');
const productClient = require('../clients/product.client');

const {
  validateUserId,
  validateCartData,
  validateCartItem,
  validateProductId,
  validateUpdateQuantity,
} = require('../utils/validator');

const createCart = async (data) => {
  validateCartData(data);

  const existing = await cartRepository.findByUserId(data.userId);

  if (existing) {
    throw {
      statusCode: 409,
      message: 'Cart already exists for this user',
    };
  }

  const cart = {
    userId: data.userId,
    items: [],
    totalPrice: 0,
  };

  return await cartRepository.create(cart);
};

const getCart = async (userId) => {
  validateUserId(userId);

  const cart = await cartRepository.findByUserId(userId);

  if (!cart) {
    throw {
      statusCode: 404,
      message: 'Cart not found for this user',
    };
  }

  return cart;
};

const addItem = async (userId, itemData) => {
  validateUserId(userId);
  validateCartItem(itemData);

  const cart = await cartRepository.findByUserId(userId);

  if (!cart) {
    throw {
      statusCode: 404,
      message: 'Cart not found for this user',
    };
  }

  // 🔥 Call Product Service
  const product = await productClient.getProductById(itemData.productId);

  const existingItemIndex = cart.items.findIndex((item) => item.productId === itemData.productId);

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += itemData.quantity;
  } else {
    cart.items.push({
      productId: product.productId,
      name: product.name,
      price: product.price,
      quantity: itemData.quantity,
    });
  }

  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return await cartRepository.update(userId, {
    items: cart.items,
    totalPrice: cart.totalPrice,
  });
};

const removeItem = async (userId, productId) => {
  validateUserId(userId);
  validateProductId(productId);

  const cart = await cartRepository.findByUserId(userId);

  if (!cart) {
    throw {
      statusCode: 404,
      message: 'Cart not found for this user',
    };
  }

  const itemIndex = cart.items.findIndex((item) => item.productId === productId);

  if (itemIndex === -1) {
    throw {
      statusCode: 404,
      message: 'Item not found in cart',
    };
  }

  cart.items.splice(itemIndex, 1);

  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return await cartRepository.update(userId, {
    items: cart.items,
    totalPrice: cart.totalPrice,
  });
};

const updateItemQuantity = async (userId, productId, data) => {
  validateUserId(userId);
  validateProductId(productId);
  validateUpdateQuantity(data);

  const cart = await cartRepository.findByUserId(userId);

  if (!cart) {
    throw {
      statusCode: 404,
      message: 'Cart not found for this user',
    };
  }

  const itemIndex = cart.items.findIndex((item) => item.productId === productId);

  if (itemIndex === -1) {
    throw {
      statusCode: 404,
      message: 'Item not found in cart',
    };
  }

  cart.items[itemIndex].quantity = data.quantity;

  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return await cartRepository.update(userId, {
    items: cart.items,
    totalPrice: cart.totalPrice,
  });
};

const clearCart = async (userId) => {
  validateUserId(userId);

  const existing = await cartRepository.findByUserId(userId);

  if (!existing) {
    throw {
      statusCode: 404,
      message: 'Cart not found for this user',
    };
  }

  return await cartRepository.remove(userId);
};

module.exports = {
  createCart,
  getCart,
  addItem,
  removeItem,
  updateItemQuantity,
  clearCart,
};
