/* eslint-disable linebreak-style */
const firebase = require("../../utils/firebase.js");

// ** LOGOUT **
exports.endpoint = (req, res) => {
  // Revoke the refresh token
  firebase.auth.getAuth()
      .revokeRefreshTokens(req.userId)
      .then(() => {
        // Return the success code
        res.status(200).json({
          "status": "success",
          "detail": "User successfully logged out !",
        });
      })
      .catch(() => {
        // Return the error code
        res.status(400).json({
          "status": "error",
          "code": 3,
          "detail": "AUTH_SERVICE_UNAVAILABLE",
        });
      });
};
