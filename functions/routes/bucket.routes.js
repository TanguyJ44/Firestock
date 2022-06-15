/* eslint-disable linebreak-style */

module.exports = (app) => {
  const DATA = require("../controllers/bucket/data.controller.js");
  const DOWNLOAD = require("../controllers/bucket/download.controller.js");
  const STORAGE = require("../controllers/bucket/storage.controller.js");
  const UPLOAD = require("../controllers/bucket/upload.controller.js");
  const FOLDER = require("../controllers/bucket/folder.controller.js");
  const RENAME = require("../controllers/bucket/rename.controller.js");
  const MOVE = require("../controllers/bucket/move.controller.js");
  const COPY = require("../controllers/bucket/copy.controller.js");
  const DELETE = require("../controllers/bucket/delete.controller.js");

  app.get("/v1/bucket/data", DATA.endpoint);
  app.get("/v1/bucket/download", DOWNLOAD.endpoint);
  app.get("/v1/bucket/storage", STORAGE.endpoint);
  app.post("/v1/bucket/upload", UPLOAD.endpoint);
  app.post("/v1/bucket/folder", FOLDER.endpoint);
  app.put("/v1/bucket/rename", RENAME.endpoint);
  app.put("/v1/bucket/move", MOVE.endpoint);
  app.put("/v1/bucket/copy", COPY.endpoint);
  app.delete("/v1/bucket/delete", DELETE.endpoint);
};
