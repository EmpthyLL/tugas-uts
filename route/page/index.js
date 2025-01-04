const express = require("express");
const {
  homeController,
  aboutController,
  categoryController,
  productController,
} = require("../controllers");
const auth = require("../../App/Middlewares/auth");

const app = express.Router();

app.get("/", auth, (req, res) => {
  console.log(req.cookies.auth_token);
  console.log(req.cookies.userId);
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
