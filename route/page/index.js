const express = require("express");
const HomeController = require("../../app/controllers/HomeController");
const AboutController = require("../../app/controllers/AboutController");
const auth = require("../../App/Middlewares/auth");
const CategoryController = require("../../app/controllers/CategoryController");
const ProductController = require("../../app/controllers/ProductController");
const LoginController = require("../../app/controllers/LoginController");
const NotifController = require("../../app/controllers/NotifController");

const app = express.Router();

const homeController = new HomeController();
const aboutController = new AboutController();
const categoryController = new CategoryController();
const productController = new ProductController();
const loginController = new LoginController();
const notifController = new NotifController();

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
app.post("/logout", auth, (req, res) => {
  loginController.logout(req, res);
});
app.get("/notification", auth, (req,res) => {
  notifController.index(req,res);
});
module.exports = app;
