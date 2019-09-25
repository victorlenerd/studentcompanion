const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const fetch = require('node-fetch');

const codeGenerator = () => `${(Math.floor(Math.random() * 9))}${(Math.floor(Math.random() * 9))}${Math.floor((Math.random() * 9))}${Math.floor((Math.random() * 9))}${Math.floor((Math.random() * 9))}${Math.floor((Math.random() * 9))}`;


admin.initializeApp();
const lt_AP = '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'
sgMail.setApiKey(lt_AP);


function sendMail({ user, code, subject, templateId, ...rest }){
  const data = {
    from: 'Student Companion <noreply@studentcompanion.com>',
    to: user.email,
    subject,
    templateId: templateId || 'd-4610d056f0644a2f9f91a52609c502af',
    dynamic_template_data: {
      activationLink: '',
      activationCode: code,
      name: user.name,
      ...rest
    }
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
    sendMail({ user, code, subject })
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
    sendMail({ user, code, subject })
    return {
      status: 'success',
    }
  } catch (err) {
    throw new functions.https.HttpsError(err);
  }
});

exports.initializePayStack = functions.https.onCall( async ({ email, amount }) => {
  const SECRET_KEY = 'sk_test_6c514bef2fd9b0b64f057d600af89fee6a666503'
   try {
     const data =   { amount, email };
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
    const result = await response.json()
    const { data: { reference, authorization_url } } = result;
    admin.database().ref('/payments')
    .push({
      email,
      amount,
      paymentType: 'card',
      reference,
      authorization_url,
      dateAdded: new Date().toISOString(),
    })
    return result.data;
   } catch (error) {
     console.log('error occurred...');
    throw new functions.https.HttpsError('Payment Error:', 'Unable to initialize payment');
   }
});


exports.verifyPayStackPayment = functions.https.onCall( async ({ reference }) => {
  const SECRET_KEY = 'sk_test_6c514bef2fd9b0b64f057d600af89fee6a666503'
   try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${SECRET_KEY}`
        },
      }
    );
    const result = await response.json()
    return result.data;
   } catch (error) {
     console.log(error);
    throw new functions.https.HttpsError('Payment Error:', error);
   }
});

exports.updatePaymentInfo = functions.https.onCall( ({ user, nextPaymentDate }) => {
  try {
    const code = codeGenerator();
    const userRef = admin.database().ref().child(`/users/${user.$id}`);
    userRef.update({ nextPaymentDate, paymentVerificationCode: code }, async err => {
      if (err !== null) throw new functions.https.HttpsError(err);
    });
    const subject = 'Payment Verification Code';
    sendMail({ user, code, subject })
    return {
      status: 'success',
      code
    }
  } catch (err) {
    throw new functions.https.HttpsError(err);
  }
});


exports.initializeManualPayment = functions.https.onCall( async ({ email, amount }) => {
   try {
    admin.database().ref('/payments')
    .push({
      email,
      amount,
      paymentType: 'manual',
      dateAdded: new Date().toISOString(),
    });
    return {
      status: 'success'
    }
   } catch (error) {
     console.log('error occurred...', error);
    throw new functions.https.HttpsError('Payment Error:', 'Unable to initialize payment');
   }
});


exports.sendFeedBack = functions.https.onCall(async ({ senderEmail, senderName, senderId, feedback }) => {
  try {
    const subject = `Feedback from ${senderName}`;
    sendMail({
      user: {
        email: 'vnwaokocha@gmail.com '
      },
      subject,
      senderEmail,
      senderName,
      senderId,
      feedback,
      templateId: 'd-763cff2a66e943aa95e9dd6ed9ae4216'
    })
    return {
      status: 'success'
    }
  } catch (error) {
    console.log('error occurred...', error);
   throw new functions.https.HttpsError('Payment Error:', 'Send feedback');
  }
});
