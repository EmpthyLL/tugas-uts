const express = require("express");
const {
  homeController,
  aboutController,
  categoryController,
  productController,
} = require("../controllers");

const app = express.Router();

app.get("/", (req, res) => {
  homeController.search === "";
  homeController.index(req, res);
});
app.get("/about", (req, res) => {
  aboutController.index(req, res);
});
app.get("/category/:categoryName?", (req, res) => {
  categoryController.index(req, res);
});
app.get("/product/:id?", (req, res) => {
  productController.index(req, res);
});

module.exports = app;
