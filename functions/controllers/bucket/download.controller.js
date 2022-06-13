/* eslint-disable linebreak-style */
const firebase = require("../../utils/firebase.js");

// ** DOWNLOAD **
exports.endpoint = (req, res) => {
  if (req.query.path === undefined || req.query.path.length < 1) {
    res.status(400).json({
      "status": "error",
      "code": 12,
      "detail": "INVALID_QUERY",
    });
  }

  const file = firebase.bucket.file(req.userId + req.query.path);
  res.status(200).json({
    "status": "success",
    "url": file.publicUrl(),
  });
};
