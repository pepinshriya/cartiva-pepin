require("express-async-errors");
const express = require("express");
const cors = require("cors");
const customerRoutes = require("./routes/customer.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/customers", customerRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

module.exports = app;
