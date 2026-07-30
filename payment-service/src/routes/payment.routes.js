const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/', paymentController.createPayment);
router.get('/order/:orderId', paymentController.getPaymentByOrder);
router.get('/:paymentId', paymentController.getPayment);
router.put('/:paymentId/status', paymentController.updatePaymentStatus);

module.exports = router;
