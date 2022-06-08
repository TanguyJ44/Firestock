/* eslint-disable linebreak-style */
const firebase = require("../../utils/firebase.js");

// ** DELETE **
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
  file.delete(function(err, apiResponse) {
    if (err) {
      return res.status(500).json({
        "status": "error",
        "code": 14,
        "detail": "UNABLE_DELETE_FILE",
      });
    } else {
      return res.status(200).json({
        "status": "success",
        "detail": "The file has been deleted !",
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

  return true;
}
