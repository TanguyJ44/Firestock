const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const rateLimit = require("express-rate-limit");
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

// Check the validity of the token
/* app.use(function(req, res, next) {
  return next;
});*/

// All route by slice
require("./routes/test.routes.js")(app);
/* require("./routes/provider.routes.js")(app);
require("./routes/sms.routes.js")(app);
require("./routes/auth.routes.js")(app);*/

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Forwarding api logic to firebase functions
// exports.api = functions.region("europe-west1").https.onRequest(app);
exports.api = functions.https.onRequest(app);
