const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const axios = require('axios');
const fetch = require('node-fetch');

const codeGenerator = () => `${(Math.floor(Math.random() * 9))}${(Math.floor(Math.random() * 9))}${Math.floor((Math.random() * 9))}${Math.floor((Math.random() * 9))}${Math.floor((Math.random() * 9))}${Math.floor((Math.random() * 9))}`;


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

exports.initializePayStack = functions.https.onCall( async ({ email, amount, reference }) => {
  const SECRET_KEY = 'sk_test_6c514bef2fd9b0b64f057d600af89fee6a666503'
   try {
     const data =   { reference, amount, email };
    const response = await fetch(
      'https://api.paystack.co/transaction/initialize',
      {
        method: 'POST',
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${SECRET_KEY}`
        },
        body: JSON.stringify(data)
      }
    );
    // const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const result = await response.json()
    return result;
   } catch (error) {
     console.log('error occurred...');
    throw new functions.https.HttpsError('Payment Error:', 'Unable to complete payment');
   }
});

exports.updatePaymentInfo = functions.https.onCall( ({ user, nextPaymentDate }) => {
  try {
    const code = codeGenerator();
    const userRef = admin.database().ref().child(`/users/${user.uid}`);
    userRef.update({ nextPaymentDate, }, async err => {
      if (err !== null) throw new functions.https.HttpsError(err);
    });
    const subject = 'Payment Verification Code';
    sendMail(user, code, subject)
    return {
      status: 'success',
      code
    }
  } catch (err) {
    throw new functions.https.HttpsError(err);
  }
});
