const AboutController = require("../app/controllers/AboutController");
const CartController = require("../app/controllers/CartController");
const CategoryController = require("../app/controllers/CategoryController");
const HistoryController = require("../app/controllers/HistoryController");
const HomeController = require("../app/controllers/HomeController");
const LoginController = require("../app/controllers/LoginController");
const MemberController = require("../app/controllers/MemberController");
const NotifController = require("../app/controllers/NotifController");
const OrderController = require("../app/controllers/OrderController");
const ProductController = require("../app/controllers/ProductController");
const ProfileController = require("../app/controllers/ProfileController");
const RegisterController = require("../app/controllers/RegisterController");
const TopupController = require("../app/controllers/TopupController");

const registerController = new RegisterController();
const loginController = new LoginController();
const homeController = new HomeController();
const aboutController = new AboutController();
const categoryController = new CategoryController();
const productController = new ProductController();
const cartController = new CartController();
const notifController = new NotifController();
const historyController = new HistoryController();
const profileController = new ProfileController();
const orderController = new OrderController();
const topupController = new TopupController();
const memberController = new MemberController();

module.exports = {
  registerController,
  loginController,
  homeController,
  aboutController,
  categoryController,
  productController,
  cartController,
  notifController,
  historyController,
  profileController,
  orderController,
  topupController,
  memberController,
};
