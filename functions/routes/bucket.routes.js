/* eslint-disable linebreak-style */

module.exports = (app) => {
  const DATA = require("../controllers/bucket/data.controller.js");
  const DOWNLOAD = require("../controllers/bucket/download.controller.js");
  const UPLOAD = require("../controllers/bucket/upload.controller.js");

  app.get("/v1/bucket/data", DATA.endpoint);
  app.get("/v1/bucket/download", DOWNLOAD.endpoint);
  app.post("/v1/bucket/upload", UPLOAD.endpoint);
};
