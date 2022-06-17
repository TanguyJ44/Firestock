/* eslint-disable linebreak-style */
const admin = require("firebase-admin");
const {Storage} = require("@google-cloud/storage");

// Retrieve service account key from json file
const serviceAccount = require("../serviceAccountKey.json");

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "firestock-cloud",
});

// Define Firebase constants
const auth = admin.auth();
const db = admin.firestore();
const storage = new Storage();
const bucket = storage.bucket("firestock-cloud");

// Export of the components to be used
module.exports = {
  auth,
  db,
  storage,
  bucket,
};
