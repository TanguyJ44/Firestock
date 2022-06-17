/* eslint-disable linebreak-style */
const firebase = require("../../utils/firebase.js");
const mail = require("../../utils/mail.js");

// ** RECOVERY **
exports.endpoint = (req, res) => {
  // check if all body parameters are correct
  if (!checkBodyParams(req.body)) {
    return res.status(400).json({
      "status": "error",
      "code": 2,
      "detail": "INCORRECT_PARAMETERS",
    });
  }

  // Start the recovery process
  startRecoveryProcess(req.body, (result) => {
    if (result[0] == true) {
      // Return confirmation recovery email sent
      res.status(200).json({
        "status": "success",
        "detail": result[1],
      });
    } else {
      // Return error code
      res.status(400).json({
        "status": "error",
        "code": result[2],
        "detail": result[1],
      });
    }
  });
};

const startRecoveryProcess = (bodyParam, _callback) => {
  checkIfPseudoExist(bodyParam, _callback);
};

/**
 * Check the validity of the query parameters
 * @param {Array} bodyParam List of query parameters
 * @return {boolean} Returns true if all parameters are correct
 */
function checkBodyParams(bodyParam) {
  // Check for pseudo [required]
  if (!bodyParam.pseudo) return false;

  return true;
}

/**
 * Check if the pseudo is already in use
 * @param {Array} bodyParam Account creation params
 * @param {Function} _callback Post-execution recall method
 */
function checkIfPseudoExist(bodyParam, _callback) {
  // Get the user infos
  firebase.db.collection("users")
      .where("pseudo", "==", bodyParam.pseudo).get()
      .then((_snapshot) => {
        if (_snapshot._size == 1) {
          _snapshot.forEach((doc) => {
            bodyParam.userId = doc._ref._path.segments[1];
            // Get user email
            getUserEmail(bodyParam, _callback);
          });
        } else {
          _callback([false, "PSEUDO_INCORECT", 9]);
        }
      }).catch(() => {
        _callback([false, "DB_SERVICE_UNAVAILABLE", 4]);
      });
}

/**
 * Retrieve account user email
 * @param {Array} bodyParam Account creation params
 * @param {Function} _callback Post-execution recall method
 */
function getUserEmail(bodyParam, _callback) {
  // Get the user infos
  firebase.auth.getUser(bodyParam.userId)
      .then((userRecord) => {
        bodyParam.email = userRecord.email;
        // Send recovery email
        sendPasswordResetEmail(bodyParam, _callback);
      })
      .catch(() => {
        _callback([false, "AUTH_SERVICE_UNAVAILABLE", 3]);
      });
}

/**
 * Generate and send the recovery link by email
 * @param {Array} bodyParam Account creation params
 * @param {Function} _callback Post-execution recall method
 */
function sendPasswordResetEmail(bodyParam, _callback) {
  const actionCodeSettings = {
    url: "https://firestock.fr/",
    handleCodeInApp: true,
  };
  // Generate a password reset link
  firebase.auth.generatePasswordResetLink(bodyParam.email, actionCodeSettings)
      .then((link) => {
        _callback([true, "Recovery email sent !"]);
        // Send recovery email
        mail.sendEmailResetPassword(bodyParam.email, bodyParam.pseudo, link);
      })
      .catch(() => {
        _callback([false, "INTERNAL_ERROR", -1]);
      });
}
