/* eslint-disable linebreak-style */
const firebase = require("../../utils/firebase.js");
const axios = require("axios");

// ** LOGIN **
exports.endpoint = (req, res) => {
  // check if all body parameters are correct
  if (!checkBodyParams(req.body)) {
    return res.status(400).json({
      "status": "error",
      "code": 2,
      "detail": "INCORRECT_PARAMETERS",
    });
  }

  startLoginProcess(req.body, (result) => {
    if (result[0] == true) {
      res.status(200).json({
        "status": "success",
        "token": result[1],
        "refreshToken": result[2],
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

const startLoginProcess = (bodyParam, _callback) => {
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
  // Check for password [required]
  if (!bodyParam.password) return false;

  return true;
}

/**
 * Check if the pseudo is already in use
 * @param {Array} bodyParam Account creation params
 * @param {Function} _callback Post-execution recall method
 */
function checkIfPseudoExist(bodyParam, _callback) {
  firebase.db.collection("users")
      .where("pseudo", "==", bodyParam.pseudo).get()
      .then((_snapshot) => {
        if (_snapshot._size == 1) {
          _snapshot.forEach((doc) => {
            bodyParam.userId = doc._ref._path.segments[1];
            manageUser(bodyParam, _callback);
          });
        } else {
          _callback([false, "PSEUDO_OR_PSWD_INCORECT", 8]);
        }
      }).catch(() => {
        _callback([false, "DB_SERVICE_UNAVAILABLE", 4]);
      });
}

/**
 * Retrieve account status before login
 * @param {Array} bodyParam Account creation params
 * @param {Function} _callback Post-execution recall method
 */
function manageUser(bodyParam, _callback) {
  firebase.auth.getUser(bodyParam.userId)
      .then((userRecord) => {
        if (!userRecord.emailVerified) {
          _callback([false, "EMAIL_NOT_VERIFIED", 7]);
        } else if (userRecord.disabled) {
          _callback([false, "ACCOUNT_DISABLED", 6]);
        } else {
          bodyParam.email = userRecord.email;
          loginUser(bodyParam, _callback);
        }
      })
      .catch(() => {
        _callback([false, "AUTH_SERVICE_UNAVAILABLE", 3]);
      });
}

/**
 * Generate a new user connection
 * @param {Array} bodyParam Account creation params
 * @param {Function} _callback Post-execution recall method
 */
function loginUser(bodyParam, _callback) {
  axios.post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBZFHQkwcNKVHXv9Mz9b4OEVFvUFM5yQL8", {
    "email": bodyParam.email,
    "password": bodyParam.password,
    "returnSecureToken": true,
  })
      .then((res) => {
        _callback([true, res.data.idToken, res.data.refreshToken]);
      })
      .catch(() => {
        _callback([false, "PSEUDO_OR_PSWD_INCORECT", 8]);
      });
}
