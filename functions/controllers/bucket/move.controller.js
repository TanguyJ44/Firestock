/* eslint-disable linebreak-style */
/* eslint-disable max-len */
const firebase = require("../../utils/firebase.js");

// ** MOVE **
exports.endpoint = (req, res) => {
  // check if all body parameters are correct
  if (!checkBodyParams(req.body)) {
    return res.status(400).json({
      "status": "error",
      "code": 2,
      "detail": "INCORRECT_PARAMETERS",
    });
  }

  const file = firebase.bucket.file(req.userId + req.body.filePath);
  // Move the file
  file.move(req.userId + req.body.destPath, function(err, destinationFile, apiResponse) {
    if (err) {
      // Return the error code
      return res.status(500).json({
        "status": "error",
        "code": 15,
        "detail": "UNABLE_MOVE_FILE",
      });
    } else {
      // Return the success code
      return res.status(200).json({
        "status": "success",
        "detail": "The file has been moved !",
      });
    }
  });
};

/**
 * Check the validity of the query parameters
 * @param {Array} bodyParam List of query parameters
 * @return {boolean} Returns true if all parameters are correct
 */
function checkBodyParams(bodyParam) {
  // Check for filePath [required]
  if (!bodyParam.filePath) return false;
  // Check for name [required]
  if (!bodyParam.destPath) return false;

  return true;
}
