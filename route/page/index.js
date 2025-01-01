const express = require("express");
const HomeController = require("../../app/controllers/HomeController");
const AboutController = require("../../app/controllers/AboutController");
const CategoryController = require("../../app/controllers/CategoryController");
const ProductController = require("../../app/controllers/ProductController");
const auth = require("../../app/middlewares/auth");

const app = express.Router();

const homeController = new HomeController();
const aboutController = new AboutController();
const categoryController = new CategoryController();
const productController = new ProductController();

app.get("/", auth, (req, res) => {
  homeController.search === "";
  homeController.index(req, res);
});
app.get("/about", auth, (req, res) => {
  aboutController.index(req, res);
});
app.get("/category/:categoryName?", auth, (req, res) => {
  categoryController.index(req, res);
});
app.get("/product/:id?", auth, (req, res) => {
  productController.index(req, res);
});

module.exports = app;
