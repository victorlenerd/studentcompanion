import { AsyncStorage } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import moment from 'moment';
import app, { toArray } from 'shared/firebase';
import { StartRequest, FinishRequest } from './request';

const api_key = 'key-93ca8e4ff39284ac39f1627abc5edd1d';
const DOMAIN = 'studentcompanion.xyz';
const mailgun = require('mailgun-js')({ apiKey: api_key, domain: DOMAIN });

const codeGenerator = () => `${(Math.floor(Math.random() * 9))}${(Math.floor(Math.random() * 9))}${Math.floor((Math.random() * 9))}${Math.floor((Math.random() * 9))}${Math.floor((Math.random() * 9))}${Math.floor((Math.random() * 9))}`;

const initialState = {
  currentUser: null
};

const SET_CURRENT_USER = 'SET_CURRENT_USER';

export const Register = data => dispatch => new Promise(async (resolve, reject) => {
  try {
    dispatch(StartRequest());
    const { email, password, phoneNumber, name } = data;
    const usr = await app.auth().createUserWithEmailAndPassword(email, password);
    const usersRefs = app.database().ref('/users');
    const trialPeriodRefs = app.database().ref('/trialPeriod');

    trialPeriodRefs.once('value', async snapshot => {
      const trialPeriod = snapshot.val();
      const nextPaymentDate = moment().add(trialPeriod, 'days');

      try {
        await usr.sendEmailVerification();

        await usersRefs.push({
          userId: usr.uid,
          name,
          email,
          phoneNumber,
          dateAdded: new Date().toISOString(),
          deviceId: DeviceInfo.getUniqueID(),
          nextPaymentDate: nextPaymentDate.toISOString(),
        });

        dispatch(SetCurrentUser({
          userId: usr.uid,
          name: data.name,
          email: data.email,
        }));

        resolve(data);
        dispatch(FinishRequest());
      } catch (err) {
        reject(err);
        dispatch(FinishRequest());
      }
    });
  } catch (err) {
    reject(err);
    dispatch(FinishRequest());
  }
});

export const Login = data => dispatch => new Promise(async (resolve, reject) => {
  try {
    const { email, password } = data;
    dispatch(StartRequest());
    const { uid: userId, name } = await app.auth().signInWithEmailAndPassword(email, password);
    dispatch(SetCurrentUser({
      userId,
      name,
      email
    }));
    resolve({ success: true, uid: userId });
    dispatch(FinishRequest());
  } catch (err) {
    reject(err);
    dispatch(FinishRequest());
  }
});

export const SendResetPasswordEmail = email => dispatch => new Promise(async (resolve, reject) => {
  try {
    dispatch(StartRequest());
    const data = app.auth().sendPasswordResetEmail(email);
    resolve(data);
    dispatch(FinishRequest());
  } catch (err) {
    dispatch(FinishRequest());
    reject(err);
  }
});

export const UserExist = email => dispatch => new Promise((resolve, reject) => {
  const usersRefs = app.database().ref('/users');
  usersRefs
    .orderByChild('email')
    .equalTo(email)
    .once('value', snapshot => {
      const value = toArray(snapshot.val());
      if (value.length < 1) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
});

export const SetCurrentUser = ({ email }) => dispatch => new Promise((resolve, reject) => {
  const usersRefs = app.database().ref('/users');

  usersRefs
    .orderByChild('email')
    .equalTo(email)
    .once('value', async snapshot => {
      const user = toArray(snapshot.val())[0];

      if (user !== null) {
        try {
          await AsyncStorage.setItem('@UPQ:CURRENT_USER', JSON.stringify(user));
          dispatch({
            type: 'SET_CURRENT_USER',
            user
          });
        } catch (err) {
          reject(err);
        }
      } else {
        resolve({ error: true, message: 'User does exist' });
      }
    });
});


export const SetCurrentUserOffline = user => dispatch => dispatch({ type: 'SET_CURRENT_USER', user });

export const GetCurrentUser = () => dispatch => new Promise(async (resolve, reject) => {
  const saved_data = await AsyncStorage.getItem('@UPQ:CURRENT_USER');

  if (saved_data === null) {
    return resolve(null);
  }

  const { email } = JSON.parse(saved_data);
  const usersRefs = app.database().ref('/users');
  usersRefs
    .orderByChild('email')
    .equalTo(email)
    .once('value', async snapshot => {
      const user = toArray(snapshot.val())[0];
      if (user !== null) {
        try {
          await AsyncStorage.setItem('@UPQ:CURRENT_USER', JSON.stringify(user));
          resolve(user);
        } catch (err) {
          reject(err);
        }
      }
    });
});

export const GetCurrentUserOffline = data => dispatch => new Promise(async (resolve, reject) => {
  const saved_data = await AsyncStorage.getItem('@UPQ:CURRENT_USER');
  try {
    const user = JSON.parse(saved_data);
    resolve(user);
  } catch (err) {
    resolve({ error: true, message: 'No Logged In User' });
  }
});

export const DeleteCurrentUser = () => dispatch => new Promise(async (resolve, reject) => {
  try {
    await AsyncStorage.removeItem('@UPQ:CURRENT_USER');
    resolve(true);
  } catch (err) {
    reject(err);
  }
});

export const SignOut = () => dispatch => new Promise(async (resolve, reject) => {
  try {
    await app.auth().signOut();
    await dispatch(DeleteCurrentUser());
    await AsyncStorage.removeItem('@UPQ:OFFLINE_COURSES');
    resolve(true);
  } catch (err) {
    reject(err);
  }
});

export const SendDeviceActivationCode = (email, $id, name) => dispatch => new Promise(async (resolve, reject) => {
  try {
    dispatch(StartRequest());
    const code = codeGenerator();
    const data = {
      from: 'Student Companion <hello@studentcompanion.xyz>',
      to: email,
      subject: 'Student Companion Device Verification Code',
      text: `Hello ${name}, your device activation code is: ${code}`
    };

    const userRef = app.database().ref(`/users/${$id}`);
    userRef.update({ deviceActivationCode: code }, async err => {
      if (err !== null) reject(err);

      mailgun.messages().send(data, function(error) {
        if (error) reject({ message: "Couldn't send the email." });
        resolve(true);
      });
    });
  } catch (err) {
    reject(err);
  }

  dispatch(FinishRequest());
});

export const SendEmailVerificationCode = (email, $id, name) => dispatch => new Promise(async (resolve, reject) => {
  try {
    dispatch(StartRequest());
    const code = codeGenerator();
    const data = {
      from: 'Student Companion <hello@studentcompanion.xyz>',
      to: email,
      subject: 'Student Companion Email Verification Code',
      text: `Hello ${name}, your verification code is: ${code}`
    };

    const userRef = app.database().ref(`/users/${$id}`);
    userRef.update({ vericationCode: code }, async err => {
      if (err !== null) reject(err);

      mailgun.messages().send(data, function(error) {
        if (error) reject({ message: "Couldn't send the email." });
        resolve(true);
      });
    });
  } catch (err) {
    reject(err);
  }

  dispatch(FinishRequest());
});

export const UpdateEmailVerification = code => dispatch => new Promise(async (resolve, reject) => {
  dispatch(StartRequest());
  try {
    const { vericationCode, $id } = await dispatch(GetCurrentUser());
    const usersRefs = app.database().ref(`/users/${$id}`);

    if (vericationCode === code) {
      usersRefs.update({ verified: true }, async err => {
        if (err !== null) reject(err);
        const newUser = await dispatch(GetCurrentUser());
        dispatch(SetCurrentUser(newUser));
        resolve(true);
      });
    } else {
      resolve(false);
    }
  } catch (err) {
    reject(err);
  }

  dispatch(FinishRequest());
});

export const SendFeedback = (userId, name, email, feedback) => dispatch => new Promise((resolve, reject) => {
  dispatch(StartRequest());

  try {
    const data = {
      from: 'Student Companion <hello@studentcompanion.xyz>',
      to: 'vnwaokocha@gmail.com',
      subject: `Feedback ${name}`,
      text: `
        ${feedback}


        ${name}
        ${email}
        ${userId}
      `
    };

    mailgun.messages().send(data, function(error) {
      if (error) reject({ message: "Couldn't send feedback." });
      resolve(true);
    });
  } catch (err) {
    reject(err);
  }

  dispatch(FinishRequest());
});

export const UpdateUserDeviceId = code => dispatch => new Promise(async (resolve, reject) => {
  dispatch(StartRequest());
  try {
    const { deviceActivationCode, $id } = await dispatch(GetCurrentUser());
    const usersRefs = app.database().ref(`/users/${$id}`);

    if (deviceActivationCode === code) {
      usersRefs.update({ deviceId: DeviceInfo.getUniqueID(), deviceActivationCode: null }, async err => {
        if (err !== null) reject(err);
        const newUser = await dispatch(GetCurrentUser());
        dispatch(SetCurrentUser(newUser));
        resolve(true);
      });
    } else {
      resolve(false);
    }
  } catch (err) {
    reject(err);
  }

  dispatch(FinishRequest());
});

export const SetAcademicInfo = (userId, { universityId, facultyId, departmentId, levelId }) => dispatch => new Promise(async (resolve, reject) => {
  dispatch(StartRequest());
  try {
    const usersRefs = app.database().ref(`/users/${userId}`);

    usersRefs.update({
      universityId,
      facultyId,
      departmentId,
      levelId
    }, err => {
      if (err !== null) reject(err);
      resolve();
    });
  } catch (err) {
    reject(err);
  }
  dispatch(FinishRequest());
});

export const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return Object.assign({}, state, {
        currentUser: action.user,
      });
    default:
      break;
  }

  return state;
};
