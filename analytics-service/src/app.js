require('express-async-errors');
const express = require('express');
const cors = require('cors');
const analyticsRoutes = require('./routes/analytics.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log('INCOMING:', req.method, req.originalUrl);
  next();
});

app.use((req, res, next) => {
  if (req.url.startsWith('/default/')) {
    req.url = req.url.replace('/default', '');
  } else if (req.url === '/default') {
    req.url = '/';
  }
  next();
});

app.use('/api/analytics', analyticsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
