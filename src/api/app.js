const express = require("express");
const cors = require("cors");
const routes = require("./routes/index");

const app = express();

// Middlewares
app.use(cors({ origin: "*"}));
app.use(express.json());

// Routes
app.use(routes);

module.exports = app;