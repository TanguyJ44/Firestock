/* eslint-disable linebreak-style */

module.exports = (app) => {
  const LOGIN = require("../controllers/auth/login.controller.js");
  const REGISTER = require("../controllers/auth/register.controller.js");

  app.post("/v1/auth/login", LOGIN.endpoint);
  app.post("/v1/auth/register", REGISTER.endpoint);
};
