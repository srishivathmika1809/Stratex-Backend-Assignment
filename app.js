const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const db = require(".");
const authRoutes = require("../myapp/routes/authRoutes");
const bookRoutes = require("../myapp/routes/bookRoutes");
const userRoutes = require("../myapp/routes/userRoutes");

require('dotenv').config();
const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
