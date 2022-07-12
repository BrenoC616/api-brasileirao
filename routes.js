const express = require("express");
const { getData } = require("./controllers/getController.js");

const routes = express.Router();

routes.get("/", (req, res) => {
  res.status(200).json({
    message: "API is online!",
  });
});

routes.get("/get/", getData);

routes.get("/*", (req, res) => {
  res.status(404).json({
    message: "Not Found!",
  });
});

module.exports = routes;
