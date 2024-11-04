const express = require("express");
const exlay = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const auth = require("./app/middlewares/auth");
const upload = require("./app/middlewares/upload");
const HomeController = require("./app/controllers/HomeController");
const LoginController = require("./app/controllers/LoginController");
const RegisterController = require("./app/controllers/RegisterController");
const AboutController = require("./app/controllers/AboutController");
const CategoryController = require("./app/controllers/CategoryController");
const ProductController = require("./app/controllers/ProductController");
const guest = require("./app/middlewares/guest");

const app = express();
const port = 3002;

app.set("view engine", "ejs");
app.use(exlay);
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

//controllers
const loginController = new LoginController();
const registerController = new RegisterController();
const homeController = new HomeController();
const aboutController = new AboutController();
const categoryController = new CategoryController();
const productController = new ProductController();

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
  registerController.index(req, res);
});
app.get("/register/user-data", guest, (req, res) => {
  registerController.step = 2;
  registerController.email = "";
  registerController.index(req, res);
});
app.post("/register/input-number", guest, (req, res) => {
  registerController.step1(req, res);
});
app.post("/register/verify-number", guest, (req, res) => {
  registerController.step2(req, res);
});
app.post("/register/user-data", guest, (req, res) => {
  registerController.store(req, res);
});
// app.get("/email-verification", (req, res) => {
//   emailverifyController.index(req, res);
// });
// app.get("/forgot-password", (req, res) => {
//   forgotpassController.index(req, res);
// });
app.get("/", auth, (req, res) => {
  homeController.index(req, res);
});
app.get("/about", auth, (req, res) => {
  aboutController.index(req, res);
});
app.get("/category/:categoryName", (req, res) => {
  categoryController.index(req, res);
});
app.get("/product/:id", (req, res) => {
  productController.index(req, res);
});
// app.get("/reset-password", (req, res) => {
//   resetpassController.index(req, res);
// });
// app.get("/verify-number", (req, res) => {
//   verifyController.index(req, res);
// });

// Route to serve the form for image upload
app.get("/upload", (req, res) => {
  res.send(`
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="image" accept="image/*" required />
      <button type="submit">Upload Image</button>
    </form>
  `);
});

const userPP = upload("ProfilePic");
// Route to handle image upload
app.post("/upload", userPP.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // Successfully uploaded
  res.send(
    `Image uploaded successfully: <a href="/uploads/ProfilePic/${req.file.filename}">View Image</a>`
  );
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
