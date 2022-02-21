/* eslint-disable linebreak-style */
const firebase = require("../../utils/firebase.js");
const mail = require("../../utils/mail.js");

// ** REGISTER **
exports.endpoint = (req, res) => {
  console.log("EMAIL :: " + req.body.email);
  // check if all body parameters are correct
  if (!checkBodyParams(req.body)) {
    return res.status(400).json({
      "status": "error",
      "code": 1,
      "detail": "One or more parameters of your " +
        "query are incorrect or missing !",
    });
  }

  if (!req.body.picture) {
    req.body.picture = "https://assets.website-files.com/5e51c674258ffe10d286d30a/5e535cf47488c27eb04a70d1_peep-97.svg";
  }

  checkIfPseudoExist(req.body, (result) => {
    if (result[0] == true) {
      res.status(200).json({
        "status": "success",
        "detail": result[1],
      });
    } else {
      res.status(400).json({
        "status": "error",
        "code": result[2],
        "detail": result[1],
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
  // Check for email [required]
  if (!bodyParam.email) return false;
  // Check for password [required]
  if (!bodyParam.password) return false;
  // Check for pseudo [required]
  if (!bodyParam.pseudo) return false;
  // Check for first name [required]
  if (!bodyParam.firstname) return false;
  // Check for last name [required]
  if (!bodyParam.lastname) return false;
  // Check for phone [required]
  if (!bodyParam.phone) return false;

  return true;
}

/**
 * Check if the pseudo is not already in use
 * @param {Array} bodyParam Account creation params
 * @param {Function} _callback Post-execution recall method
 */
function checkIfPseudoExist(bodyParam, _callback) {
  firebase.db.collection("users")
      .where("pseudo", "==", bodyParam.pseudo).get()
      .then((_snapshot) => {
        if (_snapshot._size == 0) {
          resgisterNewAccount(bodyParam, _callback);
        } else {
          _callback([false, "This pseudo is already in use !", 3]);
        }
      }).catch(() => {
        _callback([false, "Authentication service unavailable !", 2]);
      });
}

/**
 * Register a new account
 * @param {Array} bodyParam Account creation params
 * @param {Function} _callback Post-execution recall method
 */
function resgisterNewAccount(bodyParam, _callback) {
  firebase.auth.createUser({
    email: bodyParam.email,
    password: bodyParam.password,
    displayName: bodyParam.pseudo,
  })
      .then((userData) => {
        bodyParam.userUid = userData.uid;
        resgisterAccountDetails(bodyParam, _callback);
      }).catch((error) => {
        _callback([false, error, 4]);
      });
}

/**
 * Register a new account details in db
 * @param {Array} bodyParam Account creation params
 * @param {Function} _callback Post-execution recall method
 */
function resgisterAccountDetails(bodyParam, _callback) {
  firebase.db.collection("users").doc(bodyParam.userUid).set({
    rank: "user",
    pseudo: String(bodyParam.pseudo),
    firstname: String(bodyParam.firstname),
    lastname: String(bodyParam.lastname),
    phone: String(bodyParam.phone),
    picture: String(bodyParam.picture),
  }).then(() => {
    _callback([true, "New user account successfully created !"]);

    const actionCodeSettings = {
      url: "https://firestock.fr/",
      handleCodeInApp: true,
      /* iOS: {
        bundleId: "com.example.firestock",
      },
      android: {
        packageName: "com.example.firestock",
        installApp: true,
        minimumVersion: "6",
      },
      dynamicLinkDomain: "",*/
    };

    firebase.auth
        .generateEmailVerificationLink(bodyParam.email, actionCodeSettings)
        .then((link) => {
          mail.sendEmailVerification(bodyParam.email, bodyParam.pseudo, link);
        })
        .catch((error) => {
          console.log("Error : ", error);
        });
  }).catch((error) => {
    _callback([false, error, 5]);
  });
}