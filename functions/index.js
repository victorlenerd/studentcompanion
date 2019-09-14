const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');


admin.initializeApp();
const lt_AP = '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'
sgMail.setApiKey(lt_AP);


function sendMail(user, code, subject){
  const data = {
    from: 'Student Companion <noreply@studentcompanion.com>',
    to: user.email,
    subject,
    templateId: 'd-4610d056f0644a2f9f91a52609c502af',
    dynamic_template_data: { activationLink: '', activationCode: code, name: user.name }
  };
  sgMail.send(data);
}

exports.SendEmailVerificationCode = functions.https.onCall( ({ user, code }, context) => {
  try {
    const userRef = admin.database().ref(`/users/${user.id}`);
    userRef.update({ vericationCode: code }, async err => {
      if (err !== null) throw new functions.https.HttpsError(err);
    });
    const subject = 'Student Companion Email Verification Code';
    sendMail(user, code, subject)
    return {
      status: 'success',
    }
  } catch (error) {
    throw new functions.https.HttpsError(error);
  }
});

exports.SendDeviceActivationCode = functions.https.onCall( ({ user, code }, context) => {
  try {
    const userRef = admin.database().ref(`/users/${user.id}`);
    userRef.update({ deviceActivationCode: code }, async err => {
      if (err !== null) throw new functions.https.HttpsError(err);
    });
    const subject = 'Student Companion Device Verification Code';
    sendMail(user, code, subject)
    return {
      status: 'success',
    }
  } catch (err) {
    throw new functions.https.HttpsError(err);
  }
});
