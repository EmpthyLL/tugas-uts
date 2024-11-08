const express = require("express");
const exlay = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const upload = require("./app/middlewares/upload");
const HomeController = require("./app/controllers/HomeController");
const LoginController = require("./app/controllers/LoginController");
const RegisterController = require("./app/controllers/RegisterController");
const AboutController = require("./app/controllers/AboutController");
const CategoryController = require("./app/controllers/CategoryController");
const ProductController = require("./app/controllers/ProductController");
const guest = require("./app/middlewares/guest");
const auth = require("./App/Middlewares/auth");
const ProfileController = require("./app/controllers/ProfileController");
const TopupController = require("./app/controllers/TopupController");
const CartController = require("./app/controllers/CartController");

const app = express();
const port = 3002;

app.set("view engine", "ejs");
app.use(exlay);
app.use(express.json());
app.use(express.static("public"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(cookieParser());
app.use(
  session({
    secret: "your-secret-key",
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
      secure: false,
      httpOnly: true,
    },
  })
);
app.use(flash());

const userPP = upload("ProfilePic");

//controllers
const loginController = new LoginController();
const registerController = new RegisterController();
const homeController = new HomeController();
const aboutController = new AboutController();
const categoryController = new CategoryController();
const productController = new ProductController();
const profileController = new ProfileController();
const topupController = new TopupController();
const cartController = new CartController();

app.get("/sign-in", guest, (req, res) => {
  loginController.step = 0;
  registerController.no_hp = "";
  loginController.index(req, res);
});
app.get("/sign-in/verify-account", guest, (req, res) => {
  loginController.step = 1;
  loginController.index(req, res);
});
app.post("/sign-in", guest, (req, res) => {
  loginController.login(req, res);
});
app.post("/sign-in/verify-account", guest, (req, res) => {
  loginController.verify(req, res);
});
app.post("/logout", auth, (req, res) => {
  loginController.logout(req, res);
});
app.get("/register", guest, (req, res) => {
  res.redirect("/register/input-number");
});
app.get("/register/input-number", guest, (req, res) => {
  registerController.step = 0;
  registerController.no_hp = "";
  registerController.index(req, res);
});
app.get("/register/verify-number", guest, (req, res) => {
  registerController.step = 1;
  registerController.isEmail = false;
  registerController.index(req, res);
});
app.get("/register/user-data", guest, (req, res) => {
  registerController.step = 2;
  registerController.email = "";
  registerController.index(req, res);
});
app.get("/register/verify-email", guest, (req, res) => {
  registerController.step = 3;
  registerController.isEmail = true;
  registerController.index(req, res);
});
app.post("/register/input-number", guest, (req, res) => {
  registerController.step1(req, res);
});
app.post("/register/verify-number", guest, (req, res) => {
  registerController.step2(req, res);
});
app.post("/register/user-data", guest, (req, res) => {
  registerController.step3(req, res);
});
app.post("/register/verify-email", guest, (req, res) => {
  registerController.store(req, res);
});
app.get("/", auth, (req, res) => {
  homeController.search === "";
  homeController.index(req, res);
});
app.get("/about", auth, (req, res) => {
  aboutController.index(req, res);
});
app.get("/profile", auth, (req, res) => {
  profileController.step = 0;
  profileController.layout = "layout";
  profileController.index(req, res);
});
app.get("/profile/verify-email", auth, (req, res) => {
  profileController.step = 1;
  profileController.isEmail = true;
  profileController.layout = "plain";
  profileController.index(req, res);
});
app.get("/profile/verify-number", auth, (req, res) => {
  profileController.step = 1;
  profileController.isEmail = false;
  profileController.layout = "plain";
  profileController.index(req, res);
});
app.put("/profile/biodata", auth, userPP.single("profile_pic"), (req, res) => {
  profileController.editBiodata(req, res);
});
app.put("/profile/verify-email", auth, (req, res) => {
  profileController.isEmail = true;
  profileController.verify(req, res);
});
app.put("/profile/email", auth, (req, res) => {
  profileController.editDataEmail(req, res);
});
app.put("/profile/verify-number", auth, (req, res) => {
  profileController.isEmail = false;
  profileController.verify(req, res);
});
app.put("/profile/phone", auth, (req, res) => {
  profileController.editDataPhone(req, res);
});
app.get("/category/:categoryName", auth, (req, res) => {
  categoryController.index(req, res);
});
app.get("/product/:id", auth, (req, res) => {
  productController.index(req, res);
});
app.get("/topup", auth, (req, res) => {
  topupController.index(req, res);
});

app.post("/cart/add", auth, async (req, res) => {
  try {
    await cartController.addToCart(req, res);
  } catch (error) {
    console.log(error);
  }
});

app.post("/cart/increment", auth, async (req, res) => {
  try {
    await cartController.incrementItem(req, res);
  } catch (error) {
    console.log(error);
  }
});

app.post("/cart/decrement", auth, async (req, res) => {
  try {
    await cartController.decrementItem(req, res);
  } catch (error) {
    console.log(error);
  }
});
app.get("/cart", auth, async (req, res) => {
  cartController.index(req, res);
});

app.use((req, res) => {
  res.status(404);
  res.render("error/error", {
    layout: "error/error_view",
    title: "404 Page Not Found",
    code: "4 0 4",
    message: "<b>Whoops!</b> We couldn't find what you were looking for.",
  });
});

app.listen(port, () => {
  console.log(`Server is now running at http://localhost:${port}`);
});
