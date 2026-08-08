const express = require('express');
const cors = require('cors');
const inventoryRoutes = require('./routes/inventory.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/inventory', inventoryRoutes);
app.use(errorHandler);

module.exports = app;
