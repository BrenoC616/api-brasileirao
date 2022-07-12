const express = require("express");
const controller = require("./controllers/getController.js");

const routes = express.Router();

routes.get("/", (req, res) => {
  return res.status(200).json({
    message: "API is online!",
  });
});

routes.get("/get", controller.getData);

module.exports = routes;
