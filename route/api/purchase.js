const cektoken = require("../../app/middlewares/cektoken");
const express = require("express");
const { topupController } = require("../controllers");

const app = express.Router();

app.post("/topup", cektoken, async (req, res) => {
  try {
    await topupController.topup(req, res);
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
