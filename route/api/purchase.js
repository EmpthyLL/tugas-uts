const cektoken = require("../../app/middlewares/cektoken");
const express = require("express");
const { topupController, memberController } = require("../controllers");

const app = express.Router();

app.post("/topup", cektoken, async (req, res) => {
  try {
    await topupController.topup(req, res);
  } catch (error) {
    console.log(error);
  }
});
app.post("/become-member/:type", cektoken, async (req, res) => {
  try {
    await memberController.becomeMember(req, res);
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
