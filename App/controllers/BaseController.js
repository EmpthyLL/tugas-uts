const fs = require("fs");
const path = require("path");

class BaseController {
  constructor() {
    this.menus = [
      {
        title: "Home",
        href: "/home",
      },
      {
        title: "About",
        href: "/about",
      },
    ];
  }

  renderView(res, options) {
    const layoutPath = path.join(
      __dirname,
      "../../views/components",
      `${this.layout}.ejs`
    );
    const viewPath = path.join(__dirname, "../../views", `${this.view}.ejs`);

    try {
      if (!fs.existsSync(viewPath) || !fs.existsSync(layoutPath)) {
        throw new Error(`View "${this.view}" not found`);
      }

      res.render(this.view, options);
    } catch (error) {
      this.handleError(res, error.message);
    }
  }

  handleError(res, message = "Something went wrong", statusCode = 500) {
    res.status(statusCode);
    res.render("error/error", {
      layout: "error/error_view",
      title: `${statusCode} Something Went Wrong`,
      code: statusCode.toString(),
      message: `<b>Oh no!</b> ${message}`,
    });
  }
}

module.exports = BaseController;
