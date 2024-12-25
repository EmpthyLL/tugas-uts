const fs = require("fs");
const path = require("path");

class BaseController {
  constructor() {
    this.menus = [
      {
        title: "Cart",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
        href: "/cart",
      },
      {
        title: "History",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>`,
        href: "/history",
      },
      {
        title: "Notifications",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
        href: "/notification",
      },
    ];
  }

  renderView(res, view, options) {
    const layoutPath = path.join(
      __dirname,
      "../../views/components",
      `${this.layout}.ejs`
    );
    const viewPath = path.join(__dirname, "../../views", `${view}.ejs`);

    try {
      if (!fs.existsSync(viewPath) || !fs.existsSync(layoutPath)) {
        throw new Error(`View "${view}" not found`);
      }

      res.render(view, options);
    } catch (error) {
      this.handleError(res, error.message, 404);
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
