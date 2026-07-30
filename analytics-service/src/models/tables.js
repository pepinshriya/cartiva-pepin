const ORDERS_TABLE = process.env.ORDERS_TABLE || "orders";
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || "products";
const INVENTORY_TABLE = process.env.INVENTORY_TABLE || "inventory";

module.exports = { ORDERS_TABLE, PRODUCTS_TABLE, INVENTORY_TABLE };
