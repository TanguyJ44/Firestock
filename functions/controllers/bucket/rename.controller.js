/* eslint-disable linebreak-style */
const firebase = require("../../utils/firebase.js");

// ** RENAME **
exports.endpoint = (req, res) => {
  // check if all body parameters are correct
  if (!checkBodyParams(req.body)) {
    return res.status(400).json({
      "status": "error",
      "code": 2,
      "detail": "INCORRECT_PARAMETERS",
    });
  }

  const file = firebase.bucket.file(req.body.filePath);

  file.rename(req.body.name, function(err, renamedFile, apiResponse) {
    if (err) {
      return res.status(500).json({
        "status": "error",
        "code": 13,
        "detail": "UNABLE_RENAME_FILE",
      });
    } else {
      return res.status(200).json({
        "status": "success",
        "detail": "The file has been renamed !",
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
  if (!bodyParam.name) return false;

  return true;
}
