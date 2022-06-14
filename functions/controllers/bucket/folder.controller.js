/* eslint-disable linebreak-style */
/* eslint-disable max-len */
// const firebase = require("../../utils/firebase.js");

// ** FOLDER **
exports.endpoint = (req, res) => {
  // check if all body parameters are correct
  if (!checkBodyParams(req.body)) {
    return res.status(400).json({
      "status": "error",
      "code": 2,
      "detail": "INCORRECT_PARAMETERS",
    });
  }
};

/**
 * Check the validity of the query parameters
 * @param {Array} bodyParam List of query parameters
 * @return {boolean} Returns true if all parameters are correct
 */
function checkBodyParams(bodyParam) {
  // Check for filePath [required]
  if (!bodyParam.path) return false;
  // Check for name [required]
  if (!bodyParam.name) return false;

  return true;
}
