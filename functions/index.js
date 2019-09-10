const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');


admin.initializeApp();
// const API_KEY='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'
const lt_AP = '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'
sgMail.setApiKey(lt_AP);


exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const msg = {
    to: 'victorugwueze@gmail.com',
    from: 'victorugwueze@gmail.com',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  sgMail.send(msg);
  console.log(user)
  return { status: 'Created' };
});

exports.SendEmailVerificationCode = functions.https.onCall( ({ user, code }, context) => {
  const data = {
    from: 'Student Companion <hello@studentcompanion.xyz>',
    to: user.email,
    subject: 'Student Companion Email Verification Code',
    text: `Hello ${user.name}, your verification code is: ${code}`,
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  try {
    sgMail.send(data);
  // const msg = {
  //   to: 'test@example.com',
  //   from: 'test@example.com',
  //   subject: 'Sending with Twilio SendGrid is Fun',
  //   text: 'and easy to do anywhere, even with Node.js',
  //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  // };
  // sgMail.send(msg);
    const userRef = admin.database().ref(`/users/${user.$id}`);
    userRef.update({ vericationCode: code }, async err => {
      if (err !== null) throw new functions.https.HttpsError(err);
    });
    return {
      data: 'welcome',
    }
  } catch (error) {
    throw new functions.https.HttpsError(error);
  }
})
