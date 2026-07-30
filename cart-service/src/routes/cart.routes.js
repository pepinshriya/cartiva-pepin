const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.post('/', cartController.createCart);
router.get('/:userId', cartController.getCart);
router.post('/:userId/items', cartController.addItem);
router.patch('/:userId/items/:productId', cartController.updateItemQuantity);
router.delete('/:userId/items/:productId', cartController.removeItem);
router.delete('/:userId', cartController.clearCart);

module.exports = router;
