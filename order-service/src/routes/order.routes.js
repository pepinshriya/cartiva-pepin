const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/', orderController.placeOrder);

router.get('/', orderController.getAllOrders);

router.get('/user/:userId', orderController.getUserOrders);

router.get('/:orderId', orderController.getOrder);

router.get('/:orderId/timeline', orderController.getOrderTimeline);

router.put('/:orderId/status', orderController.updateOrderStatus);

router.put('/:orderId/cancel', orderController.cancelOrder);

module.exports = router;
