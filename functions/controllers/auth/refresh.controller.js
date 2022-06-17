/* eslint-disable linebreak-style */
const axios = require("axios");

// ** REFRESH **
exports.endpoint = (req, res) => {
  // check if all body parameters are correct
  if (!checkBodyParams(req.body)) {
    return res.status(400).json({
      "status": "error",
      "code": 2,
      "detail": "INCORRECT_PARAMETERS",
    });
  }

  // Start the refresh token process
  axios.post("https://securetoken.googleapis.com/v1/token?key=AIzaSyBZFHQkwcNKVHXv9Mz9b4OEVFvUFM5yQL8", {
    "grant_type": "refresh_token",
    "refresh_token": req.body.refreshToken,
  })
      .then((result) => {
        // Return the new token
        res.status(200).json({
          "status": "success",
          "token": result.data.id_token,
        });
      })
      .catch(() => {
        // Return the error code
        res.status(400).json({
          "status": "error",
          "code": 1,
          "detail": "INVALID_OR_EXPIRED_R_TOKEN",
        });
      });
};

/**
 * Check the validity of the query parameters
 * @param {Array} bodyParam List of query parameters
 * @return {boolean} Returns true if all parameters are correct
 */
function checkBodyParams(bodyParam) {
  // Check for refreshToken [required]
  if (!bodyParam.refreshToken) return false;

  return true;
}
