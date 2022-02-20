/* eslint-disable linebreak-style */
const admin = require("firebase-admin");

const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
const db = admin.firestore();

// Export of the components to be used
module.exports = {
  auth,
  db,
};
