/* eslint-disable linebreak-style */
/* eslint-disable max-len */
const firebase = require("../../utils/firebase.js");

// ** STORAGE **
exports.endpoint = (req, res) => {
  const storageSize = new Promise((resolve, reject) => {
    // Get the user files
    firebase.bucket.getFiles({
      prefix: req.userId + "/",
    }, (err, files) => {
      if (err) {
        reject(err);
      } else {
        // calculate the storage size
        let size = 0;
        files.forEach((file) => {
          size += parseInt(file.metadata.size);
        });
        size = (size * 100) / 1073741824;
        resolve(parseInt(size, 10));
      }
    });
  });

  storageSize.then(function(result) {
    // Return the percentage of the storage used
    return res.status(200).json({
      "status": "success",
      "percent": result,
    });
  })
      .catch(function(err) {
        // Return the error code
        return res.status(500).json({
          "status": "error",
          "code": 5,
          "detail": "STORAGE_SERVICE_UNAVAILABLE",
        });
      });
};
