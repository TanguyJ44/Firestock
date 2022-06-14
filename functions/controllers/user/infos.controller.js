/* eslint-disable linebreak-style */
const firebase = require("../../utils/firebase.js");

// ** INFOS **
exports.endpoint = (req, res) => {
  firebase.db.collection("users").doc(req.userId).get()
      .then((doc) => {
        if (doc.exists) {
          firebase.auth.getUser(req.userId)
              .then((userRecord) => {
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
                res.status(500).json({
                  "status": "error",
                  "code": -99,
                  "detail": "?",
                });
              });
        } else {
          res.status(404).json({
            "status": "error",
            "code": -99,
            "detail": "?",
          });
        }
      }
      )
      .catch((err) => {
        res.status(500).json({
          "status": "error",
          "code": -99,
          "detail": "?",
        });
      });
};
