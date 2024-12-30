const express = require("express");
const auth = require("../../App/Middlewares/auth");
const NotifController = require("../../app/controllers/NotifController");

const app = express.Router();

const notifController = new NotifController();

app.get("/notification", auth, async (req, res) => {
  notifController.index(req, res);
});
app.get("/:id", auth, async (req, res) => {
  notifController.index(req, res);
});

module.exports = app;
