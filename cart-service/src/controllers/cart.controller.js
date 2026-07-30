const cartService = require('../services/cart.service');
const response = require('../utils/response');

const createCart = async (req, res, next) => {
  try {
    const cart = await cartService.createCart(req.body);
    return response.created(res, cart);
  } catch (err) {
    next(err);
  }
};

const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.params.userId);
    return response.success(res, cart);
  } catch (err) {
    next(err);
  }
};

const addItem = async (req, res, next) => {
  try {
    const cart = await cartService.addItem(req.params.userId, req.body);
    return response.success(res, cart);
  } catch (err) {
    next(err);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const cart = await cartService.removeItem(req.params.userId, req.params.productId);
    return response.success(res, cart);
  } catch (err) {
    next(err);
  }
};

const updateItemQuantity = async (req, res, next) => {
  try {
    const cart = await cartService.updateItemQuantity(
      req.params.userId,
      req.params.productId,
      req.body
    );
    return response.success(res, { message: 'Cart updated successfully', cart });
  } catch (err) {
    next(err);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const result = await cartService.clearCart(req.params.userId);
    return response.success(res, { message: 'Cart cleared successfully', userId: result.userId });
  } catch (err) {
    next(err);
  }
};

module.exports = { createCart, getCart, addItem, removeItem, updateItemQuantity, clearCart };
