const express = require("express");
const { memberController } = require("../../controllers");

const app = express.Router();

app.get("/", (req, res) => {
  memberController.index(req, res);
});

module.exports = app;
