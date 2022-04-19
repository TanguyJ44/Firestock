/* eslint-disable linebreak-style */
const firebase = require("../../utils/firebase.js");

// ** DATA **
exports.endpoint = (req, res) => {
  if (req.query.path === undefined || req.query.path.length < 1) {
    res.status(400).json({
      "status": "error",
      "code": 12,
      "detail": "INVALID_QUERY",
    });
  }

  const formatFiles = [];

  const folderPrefix = req.userId + req.query.path;
  firebase.bucket.getFiles({prefix: folderPrefix}, function(err, files) {
    if (!err) {
      files.forEach((file) => {
        formatFiles.push(file.name.replace(folderPrefix, ""));
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
