const fs = require("fs");
const path = require("path");
const { formatDate, formatCurrency } = require("../../utils/formater");
const cartModel = require("../../database/model/cartModel");
const historyModel = require("../../database/model/historyModel");
const notifModel = require("../../database/model/notifModel");
const userModel = require("../../database/model/userModel");

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

  async renderView(res, view, options) {
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
      const { user, cart, history, notification } = await this.getDefaultData(
        options.req
      );
      res.render(view, {
        ...options,
        formatDate,
        formatCurrency,
        menus: this.menus,
        user,
        cart,
        history,
        notification,
        toastr: options.req.toastr,
      });
    } catch (error) {
      console.log(error);
      this.handleError(res, error.message, 404);
    }
  }

  handleError(res, message = "Something went wrong", statusCode = 500) {
    const title = {
      4: "Web Page Error",
      5: "Server Went Wrong",
    };
    res.status(statusCode);
    res.render("error/error", {
      layout: "error/error_view",
      title: `${statusCode} ` + title[statusCode.toString()[0]],
      code: statusCode.toString(),
      message: `<b>Oh no!</b> ${message}`,
    });
  }
  async getDefaultData(req, res) {
    let user = null;
    let cart = [];
    let history = [];
    let notification = [];
    if (req.cookies.userId) {
      user = await userModel.getUserByUUID(req.cookies.userId);
      cart = await cartModel.getUserCartList(req.cookies.userId);
      history = await historyModel.getHistories(req.cookies.userId);
      notification = await notifModel.getNotif(req.cookies.userId);
      cart = {
        id: cart.dataValues.id,
        user_id: cart.dataValues.user_id,
        cart_total: cart.dataValues.cart_total,
        tax: cart.dataValues.tax,
        member_discount: cart.dataValues.member_discount,
        delivery: cart.dataValues.delivery,
        total: cart.dataValues.total,
        created_at: cart.dataValues.created_at,
        updated_at: cart.dataValues.updated_at,
        deleted_at: cart.dataValues.deleted_at,
        items: cart.dataValues.CartItems.map((item) => {
          return {
            id: item.dataValues.item_id,
            title: item.dataValues.title,
            quantity: item.dataValues.quantity,
            brand: item.dataValues.brand,
            category: item.dataValues.category,
            thumbnail: item.dataValues.thumbnail,
            price: item.dataValues.price,
            total: item.dataValues.total,
          };
        }),
      };
    }
    return { user, cart, history, notification };
  }
}

module.exports = BaseController;
