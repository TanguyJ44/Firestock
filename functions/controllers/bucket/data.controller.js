/* eslint-disable linebreak-style */
/* eslint-disable max-len */
const firebase = require("../../utils/firebase.js");

// ** DATA **
exports.endpoint = (req, res) => {
  if (req.query.path === undefined || req.query.path.length < 1) {
    return res.status(400).json({
      "status": "error",
      "code": 12,
      "detail": "INVALID_QUERY",
    });
  }

  const formatFiles = [];

  const folderPrefix = req.userId + req.query.path;
  firebase.bucket.getFiles({
    prefix: folderPrefix,
    delimiter: "/",
    includeTrailingDelimiter: true,
  }, function(err, files) {
    if (!err) {
      files.forEach((file) => {
        console.log(file);
        formatFiles.push({
          name: (file.name.slice(-1) != "/") ? file.name.replace(folderPrefix, "") : file.name.replace(folderPrefix, "").slice(0, -1),
          type: (file.name.slice(-1) != "/") ? file.metadata.contentType : "folder",
          created: file.metadata.timeCreated,
          updated: file.metadata.updated,
          size: file.metadata.size,
        });
      });
      formatFiles.shift();
      console.log(formatFiles);
      res.json(formatFiles);
    } else {
      console.log(err);
      res.json(err);
    }
  });
};
