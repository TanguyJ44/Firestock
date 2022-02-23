const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const rateLimit = require("express-rate-limit");
const firebase = require("./utils/firebase.js");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// Declaration of the application with express
const app = express();

// Allow Access-Control from remote access
app.use(cors({origin: true}));

// Limit of requests over 10 minutes
/* const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000,
});*/

// Analyze content type requests - application/json
app.use(bodyParser.json());

// Analyze content type requests - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// Apply the limit to all requests
// app.use(limiter);

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
          "detail": "Invalid or expired token !",
        });
      });
});

// All route by slice
require("./routes/auth.routes.js")(app);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Forwarding api logic to firebase functions
exports.api = functions.region("europe-west1").https.onRequest(app);
