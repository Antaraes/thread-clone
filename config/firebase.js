var admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

const myAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://thread-2fca0.appspot.com",
});

module.exports = { myAdmin };
