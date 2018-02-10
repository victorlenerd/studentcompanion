import { AsyncStorage } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import moment from 'moment';
import app, { toArray } from 'shared/firebase';
import { StartRequest, FinishRequest } from './request';

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


export const GetCurrentUser = () => dispatch => new Promise(async (resolve, reject) => {
  const saved_data = await AsyncStorage.getItem('@UPQ:CURRENT_USER');
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
      } else {
        // dispatch(DeleteCurrentUser()).then(() => {
        //   navigator.welcome();
        // });
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
    resolve();
  } catch (err) {
    reject(err);
  }
});

export const SendDeviceActivationCode = email => dispatch => new Promise(async (resolve, reject) => {
  try {
    const { code } = await fetch('https://victor-com-ng.appspot.com/send_device_activate_code_upq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to_email: email,
      }),
    }).then(response => response.json());

    const usersRefs = app.database().ref('/users');
    const ref = usersRefs.orderByChild('email').equalTo(email);

    ref.once('value', snapshot => {
      const usr = toArray(snapshot.val())[0];
      const userRef = app.database().ref(`/users/${usr.$id}`);
      userRef.update({ deviceActivationCode: code }, async err => {
        if (err !== null) reject(err);
        await dispatch(SetCurrentUser({ email }));
        resolve();
      });
    });
  } catch (err) {
    reject(err);
  }
});

export const UpdateUserDeviceId = code => dispatch => new Promise(async (resolve, reject) => {
  try {
    const { deviceActivationCode, $id } = await dispatch(GetCurrentUser());
    const usersRefs = app.database().ref(`/users/${$id}`);
    if (deviceActivationCode === code) {
      usersRefs.update({ deviceId: DeviceInfo.getUniqueID(), deviceActivationCode: null }, async err => {
        if (err !== null) reject(err);
        const newUser = await dispatch(GetCurrentUser());
        await dispatch(SetCurrentUser(newUser));
        resolve();
      });
    } else {
      resolve({ error: true, message: 'Code is incorrect.' });
    }
  } catch (err) {
    reject(err);
  }
});

export const SetAcademicInfo = (userId, { universityId, facultyId, departmentId, levelId }) => dispatch => new Promise(async (resolve, reject) => {
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
