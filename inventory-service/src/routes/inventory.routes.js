const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');

router.get('/', inventoryController.getAllInventory);
router.post('/', inventoryController.addStock);
router.get('/:productId', inventoryController.getStock);
router.put('/:productId', inventoryController.updateStock);
router.patch('/:productId/reduce', inventoryController.reduceStock);
router.patch('/:productId/increase', inventoryController.increaseStock);

module.exports = router;
