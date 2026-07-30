const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");
const revenueController = require("../controllers/revenue.controller");
const recentOrdersController = require("../controllers/recentOrders.controller");
const topProductsController = require("../controllers/topProducts.controller");
const lowStockController = require("../controllers/lowStock.controller");

router.get("/dashboard", dashboardController.getDashboard);
router.get("/revenue", revenueController.getRevenue);
router.get("/recent-orders", recentOrdersController.getRecentOrders);
router.get("/top-products", topProductsController.getTopProducts);
router.get("/low-stock", lowStockController.getLowStock);

module.exports = router;
