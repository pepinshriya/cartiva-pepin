const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/payment.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/payments', paymentRoutes);
app.use(errorHandler);

module.exports = app;
