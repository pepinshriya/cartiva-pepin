require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3002;
console.log("AWS Region:", process.env.AWS_REGION);
console.log("Table Name:", process.env.TABLE_NAME);

app.listen(PORT, () => {
  console.log(`Inventory service running on port ${PORT}`);
});
