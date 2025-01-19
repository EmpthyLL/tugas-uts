const express = require("express");
const exlay = require("express-ejs-layouts");
const session = require("express-session");
const serveFavicon = require("serve-favicon");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const auth = require("../app/middlewares/auth");
const sequelize = require("../database/config/db");

const indexPage = require("./page/index");
const loginPage = require("./page/auth/sign-in");
const registerPage = require("./page/auth/register");
const cartPage = require("./page/cart");
const topupPage = require("./page/purchase/topup");
const memberPage = require("./page/purchase/member");
const profilePage = require("./page/profile");
const historyPage = require("./page/history");
const notifPage = require("./page/notification");
const orderPage = require("./page/order");

const authApi = require("./api/auth");
const cartApi = require("./api/cart");
const purchaseApi = require("./api/purchase");
const orderApi = require("./api/order");
const notifApi = require("./api/notif");

const app = express();
const port = process.env.PORT;
const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.use(exlay);
app.use(express.json());
app.use(express.static("public"));
app.use("/node_modules", express.static(__dirname + "/../node_modules"));
app.use(serveFavicon(path.join(__dirname, "/../public/img", "a3mart.ico")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(cookieParser());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(auth);
sequelize.sync();
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.use("/", indexPage);
app.use("/sign-in", loginPage);
app.use("/register", registerPage);
app.use("/profile", profilePage);
app.use("/cart", cartPage);
app.use("/notification", notifPage);
app.use("/history", historyPage);
app.use("/order", orderPage);
app.use("/top-up", topupPage);
app.use("/become-member", memberPage);

app.use("/api/auth", authApi);
app.use("/api/cart", cartApi);
app.use("/api/purchase", purchaseApi);
app.use("/api/order", orderApi);
app.use("/api/notif", notifApi);

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
