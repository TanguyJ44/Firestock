const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const firebase = require("./utils/firebase.js");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// Declaration of the application with express
const app = express();

// Allow Access-Control from remote access
app.use(cors({
  origin: true,
}));

// Analyze content type requests - application/json
app.use(bodyParser.json());

// Analyze content type requests - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true,
}));

// Check if the endpoint should be authenticated
app.use((req, res, next) => {
  switch (req.path) {
    case "/v1/auth/login":
    case "/v1/auth/register":
    case "/v1/auth/recovery":
    case "/v1/auth/refresh":
      req.bypass = true;
      break;
    default:
      req.bypass = false;
      break;
  }

  if (req.path.includes("/api-docs/")) req.bypass = true;

  next();
});

// Check the validity of the token
app.use((req, res, next) => {
  if (req.bypass) return next();
  if (!req.headers.authorization) {
    req.headers.authorization = "null";
  }

  const reqAuth = req.headers.authorization
      .replace("Bearer ", "");

  firebase.auth.verifyIdToken(reqAuth)
      .then((decodedToken) => {
        req.userId = decodedToken.uid;
        next();
      })
      .catch(() => {
        res.status(400).json({
          "status": "error",
          "code": 0,
          "detail": "INVALID_OR_EXPIRED_TOKEN",
        });
      });
});

// All route by slice
require("./routes/auth.routes.js")(app);
require("./routes/user.routes.js")(app);
require("./routes/bucket.routes.js")(app);

// Swagger API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Forwarding api logic to firebase functions
exports.api = functions.region("europe-west1").https.onRequest(app);
