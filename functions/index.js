const functions = require("firebase-functions");

const admin = require("firebase-admin");

admin.initializeApp();

exports.addTeacherRole = functions.https.onCall((data, context) => {
  // check request is made by an admin

  if (context.auth.token.admin !== true) {
    return { error: "only Admin can add other Teacher" };
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

exports.addAdminRole = functions.https.onCall((data, context) => {
  // check request is made by an admin

  if (context.auth.token.admin !== true) {
    return { error: "only Admin can add other Admin" };
  }

  // get user and add custom claim (teacher)
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then((user) => {
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: true,
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
