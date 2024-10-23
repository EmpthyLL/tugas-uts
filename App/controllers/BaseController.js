const fs = require("fs");
const path = require("path");

class BaseController {
  viewExists(view) {
    const viewPath = path.join(__dirname, "../../views", `${view}.ejs`);
    return fs.existsSync(viewPath);
  }

  renderView(res, view, options = {}) {
    try {
      if (!this.viewExists(view)) {
        throw new Error(`View "${view}" not found`);
      }

      res.render(view, options);
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
