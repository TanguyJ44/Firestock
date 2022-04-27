/* eslint-disable linebreak-style */
const firebase = require("../../utils/firebase.js");
const formidable = require("formidable-serverless");

// ** UPLOAD **
exports.endpoint = (req, res) => {
  const form = new formidable.IncomingForm();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      const file = files.file;
      if (!file) {
        reject(new Error("no file to upload, please choose a file."));
        return;
      }

      const response = firebase.bucket.upload(file.path, {
        contentType: file.type,
        destination: req.userId + "/" + file.name,
      });

      resolve({
        fileInfo: response.metadata,
      });
    });
  })
      .then((response) => {
        res.status(400).json({
          "status": "success",
          "detail": "File uploaded successfully !",
        });
        return null;
      })
      .catch((err) => {
        console.error("Error while parsing form: " + err);
        res.status(400).json({
          "status": "error",
          "code": 999,
          "detail": "?",
        });
      });
};
