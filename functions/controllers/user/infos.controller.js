/* eslint-disable linebreak-style */
const firebase = require("../../utils/firebase.js");

// ** INFOS **
exports.endpoint = (req, res) => {
  // Get the user infos
  firebase.db.collection("users").doc(req.userId).get()
      .then((doc) => {
        if (doc.exists) {
          // Get user email
          firebase.auth.getUser(req.userId)
              .then((userRecord) => {
                // Send user infos
                res.status(200).json({
                  "status": "success",
                  "user": {
                    "firstname": doc.data().firstname,
                    "lastname": doc.data().lastname,
                    "phone": doc.data().phone,
                    "email": userRecord.email,
                    "pseudo": doc.data().pseudo,
                    "picture": doc.data().picture,
                  },
                });
              })
              .catch(() => {
                // Error while getting user email
                res.status(500).json({
                  "status": "error",
                  "code": 3,
                  "detail": "AUTH_SERVICE_UNAVAILABLE",
                });
              });
        } else {
          // User not found
          res.status(404).json({
            "status": "error",
            "code": 18,
            "detail": "INVALID_USER",
          });
        }
      }
      )
      .catch((err) => {
        // Error while getting user infos
        res.status(500).json({
          "status": "error",
          "code": 4,
          "detail": "DB_SERVICE_UNAVAILABLE",
        });
      });
};
