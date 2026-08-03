require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3006;
// server running....

app.listen(PORT, () => {
  console.log(`Customer service running on port ${PORT}`);
});
