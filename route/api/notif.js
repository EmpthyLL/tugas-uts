const express = require("express");
const cektoken = require("../../app/middlewares/cektoken");
const { notifController } = require("../controllers");

const app = express.Router();

app.get("/", cektoken, async (req, res) => {
  await notifController.getAll(req, res);
});
app.get("/:category", cektoken, async (req, res) => {
  await notifController.getCategory(req, res);
});
app.post("/read/:id", cektoken, async (req, res) => {
  await notifController.markAsRead(req, res);
});

module.exports = app;
