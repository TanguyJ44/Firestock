/* eslint-disable linebreak-style */
const firebase = require("../../utils/firebase.js");
const mail = require("../../utils/mail.js");

// ** REGISTER **
exports.endpoint = (req, res) => {
  // check if all body parameters are correct
  if (!checkBodyParams(req.body)) {
    return res.status(400).json({
      "status": "error",
      "code": 2,
      "detail": "INCORRECT_PARAMETERS",
    });
  }

  // Define default picture
  if (!req.body.picture) {
    req.body.picture = "https://assets.website-files.com/5e51c674258ffe10d286d30a/5e535cf47488c27eb04a70d1_peep-97.svg";
  }

  // Start register process
  startRegisterProcess(req.body, (result) => {
    if (result[0] == true) {
      // Return success response
      res.status(200).json({
        "status": "success",
        "detail": result[1],
      });
    } else {
      // Return error response
      res.status(400).json({
        "status": "error",
        "code": result[2],
        "detail": result[1],
      });
    }
  });
};

const startRegisterProcess = (bodyParam, _callback) => {
  checkIfPseudoExist(bodyParam, _callback);
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
 * Check if the pseudo is already in use
 * @param {Array} bodyParam Account creation params
 * @param {Function} _callback Post-execution recall method
 */
function checkIfPseudoExist(bodyParam, _callback) {
  // Check if the pseudo is already in use
  firebase.db.collection("users")
      .where("pseudo", "==", bodyParam.pseudo).get()
      .then((_snapshot) => {
        if (_snapshot._size == 0) {
          // Pseudo is not in use
          resgisterNewAccount(bodyParam, _callback);
        } else {
          _callback([false, "PSEUDO_ALREADY_IN_USE", 11]);
        }
      }).catch(() => {
        _callback([false, "DB_SERVICE_UNAVAILABLE", 4]);
      });
}

/**
 * Register a new account
 * @param {Array} bodyParam Account creation params
 * @param {Function} _callback Post-execution recall method
 */
function resgisterNewAccount(bodyParam, _callback) {
  // Create a new user account
  firebase.auth.createUser({
    email: bodyParam.email,
    password: bodyParam.password,
    displayName: bodyParam.pseudo,
  })
      .then((userData) => {
        bodyParam.userUid = userData.uid;
        // Register account details
        resgisterAccountDetails(bodyParam, _callback);
      }).catch(() => {
        _callback([false, "EMAIL_ALREADY_IN_USE", 10]);
      });
}

/**
 * Register a new account details in db
 * @param {Array} bodyParam Account creation params
 * @param {Function} _callback Post-execution recall method
 */
function resgisterAccountDetails(bodyParam, _callback) {
  // Register account details in DB
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
    };

    // Send email with verification link
    firebase.auth
        .generateEmailVerificationLink(bodyParam.email, actionCodeSettings)
        .then((link) => {
          // Send email with verification link
          mail.sendEmailVerification(bodyParam.email, bodyParam.pseudo, link);
        })
        .catch((error) => {
          console.log("Error : ", error);
        });
  }).catch(() => {
    _callback([false, "INTERNAL_ERROR", -1]);
  });
}
