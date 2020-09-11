const functions = require("firebase-functions");

const admin = require("firebase-admin");

admin.initializeApp();

exports.addTeacherRole = functions.https.onCall((data, context) => {
  // check request is made by an admin

  if (context.auth.token.teacher !== true) {
    return { error: "only Teacher can add other Teacher" };
  }

  // get user and add custom claim (teacher)
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then((user) => {
      return admin.auth().setCustomUserClaims(user.uid, {
        teacher: true,
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} Has been made an admin`,
      };
    })
    .catch((err) => {
      return err;
    });
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
