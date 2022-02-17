/* eslint-disable linebreak-style */

module.exports = (app) => {
  const test = require("../controllers/test.controller.js");

  app.get("/v1/test/hello", test.hello);
};

