const express = require('express');
const cors = require('cors');
const cartRoutes = require('./routes/cart.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/cart', cartRoutes);
app.use(errorHandler);

module.exports = app;
