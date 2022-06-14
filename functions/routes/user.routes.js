/* eslint-disable linebreak-style */

module.exports = (app) => {
  const INFOS = require("../controllers/user/infos.controller.js");

  app.get("/v1/user/infos", INFOS.endpoint);
};

