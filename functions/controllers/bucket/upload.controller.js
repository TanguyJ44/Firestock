/* eslint-disable linebreak-style */
const firebase = require("../../utils/firebase.js");
const formidable = require("formidable-serverless");

// ** UPLOAD **
exports.endpoint = (req, res) => {
  // Read form data parameters
  const form = new formidable.IncomingForm();
  return new Promise((resolve, reject) => {
    // Parse the form data
    form.parse(req, (err, fields, files) => {
      if (fields.path === undefined || fields.path < 1) {
        reject(new Error("Invalid PATH !"));
        // Return the error code
        return res.status(400).json({
          "status": "error",
          "code": 12,
          "detail": "INVALID_QUERY",
        });
      }

      const file = files.file;
      if (!file) {
        reject(new Error("No file to upload, please choose a file !"));
        return;
      }

      // Upload the file in Firestore
      const response = firebase.bucket.upload(file.path, {
        contentType: file.type,
        destination: req.userId + fields.path + file.name,
      });

      resolve({
        fileInfo: response.metadata,
      });
    });
  })
      .then((response) => {
        // Return success response
        res.status(200).json({
          "status": "success",
          "detail": "File uploaded successfully !",
        });
        return null;
      })
      .catch((err) => {
        // Return the error code
        res.status(400).json({
          "status": "error",
          "code": 19,
          "detail": "UPLOAD_FILE_ERROR",
        });
      });
};
