/* eslint-disable linebreak-style */
const firebase = require("../../utils/firebase.js");

// ** LOGOUT **
exports.endpoint = (req, res) => {
  firebase.auth.getAuth()
      .revokeRefreshTokens(req.userId)
      .then(() => {
        res.status(200).json({
          "status": "success",
          "detail": "User successfully logged out !",
        });
      })
      .catch(() => {
        res.status(400).json({
          "status": "error",
          "code": 3,
          "detail": "AUTH_SERVICE_UNAVAILABLE",
        });
      });
};
