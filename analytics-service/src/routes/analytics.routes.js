const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');
const revenueController = require('../controllers/revenue.controller');
const recentOrdersController = require('../controllers/recentOrders.controller');
const topProductsController = require('../controllers/topProducts.controller');
const lowStockController = require('../controllers/lowStock.controller');
const reportsController = require('../controllers/reports.controller');

router.get('/dashboard', dashboardController.getDashboard);
router.get('/revenue', revenueController.getRevenue);
router.get('/recent-orders', recentOrdersController.getRecentOrders);
router.get('/top-products', topProductsController.getTopProducts);
router.get('/low-stock', lowStockController.getLowStock);

router.get('/reports/sales', reportsController.getSalesReport);
router.get('/reports/inventory', reportsController.getInventoryReport);
router.get('/reports/customers', reportsController.getCustomerReport);

module.exports = router;
