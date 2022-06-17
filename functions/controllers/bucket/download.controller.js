/* eslint-disable linebreak-style */
const firebase = require("../../utils/firebase.js");

// ** DOWNLOAD **
exports.endpoint = (req, res) => {
  // check if all body parameters are correct
  if (req.query.path === undefined || req.query.path.length < 1) {
    res.status(400).json({
      "status": "error",
      "code": 12,
      "detail": "INVALID_QUERY",
    });
  }

  // Get the file
  const file = firebase.bucket.file(req.userId + req.query.path);

  // Make the file public
  file.makePublic(function(err, apiResponse) {
    if (err) {
      // Return the error code
      res.status(500).json({
        "status": "error",
        "code": 17,
        "detail": "DOWNLOAD_LINK_BROKEN",
      });
    } else {
      // Return the download link
      res.status(200).json({
        "status": "success",
        "url": file.publicUrl(),
      });
    }
  });
};
