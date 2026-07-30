require('express-async-errors');
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/product.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// TEMPORARY — request logger, remove once debugging is done
app.use((req, res, next) => {
  console.log('INCOMING:', req.method, req.originalUrl);
  next();
});

// Strip the API Gateway stage prefix ("default") before routing
app.use((req, res, next) => {
  if (req.url.startsWith('/default/')) {
    req.url = req.url.replace('/default', '');
  } else if (req.url === '/default') {
    req.url = '/';
  }
  next();
});

app.use('/api/products', productRoutes);

// 404 for anything unmatched
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler — must be LAST
app.use(errorHandler);

module.exports = app;
