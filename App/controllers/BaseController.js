const fs = require("fs");
const path = require("path");
const { title } = require("process");

class BaseController {
  constructor(view, layout) {
    this.view = view;
    this.layout = layout;
    this.menus = [
      {
        title: "Home",
        href: "/",
      },
      {
        title: "About",
        href: "/about",
      },
    ];
  }
  viewExists() {
    const viewPath = path.join(__dirname, "../../views", `${this.view}.ejs`);
    return fs.existsSync(viewPath);
  }

  renderView(res, options) {
    try {
      if (!this.viewExists(this.view)) {
        throw new Error(`View "${this.view}" not found`);
      }

      res.render(this.view, options);
    } catch (error) {
      this.handleError(res, error.message, 500);
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
