import moment from 'moment';

import app, { toArray } from 'shared/firebase';
import { StartRequest, FinishRequest } from './request';
import { SetCurrentUser } from './user';

const SET_PRICE = 'SET_PRICE';

const initialState = {
  price: 0,
};

const usersRefs = app.database().ref('/users');

export const SetPrice = price => {
  return {
    type: SET_PRICE,
    price,
  };
};

export const GetPrice = () => dispatch => new Promise((resolve, reject) => {
  const priceRef = app.database().ref('/price');
  dispatch(StartRequest());
  priceRef.once('value', snapshot => {
    dispatch(SetPrice(snapshot.val()));
    dispatch(FinishRequest());
    resolve();
  });
});

export const MakePayment = (email, amount) => dispatch => new Promise((resolve, reject) => {
  const ref = usersRefs.orderByChild('email').equalTo(email);
  dispatch(StartRequest());

  ref.once('value', snapshot => {
    const usr = toArray(snapshot.val())[0];
    const now = moment();
    let numberOfDays;

    const userRef = app.database().ref(`/users/${usr.$id}`);
    if (amount === 10000) {
      numberOfDays = 31;
    }

    if (amount === 100000) {
      numberOfDays = 365;
    }

    const newNextPaymentDate = now.add(numberOfDays, 'days');

    userRef.update(
      {
        nextPaymentDate: newNextPaymentDate.toISOString(),
      },
      async err => {
        userRef.off();
        if (err !== null) reject(err);
        try {
          await dispatch(SetCurrentUser({ email }));
          resolve();
        } catch (errr) {
          reject(errr);
        }

        dispatch(FinishRequest());
      }
    );
  });
});

export const SetFreeCourseId = (email, courseId) => dispatch => new Promise((resolve, reject) => {
  const ref = usersRefs.orderByChild('email').equalTo(email);
  dispatch(StartRequest());

  ref.once('value', snapshot => {
    const usr = toArray(snapshot.val())[0];
    const userRef = app.database().ref(`/users/${usr.$id}`);
    userRef.update({ freeCourseId: courseId }, async err => {
      if (err !== null) reject(err);
      try {
        await dispatch(SetCurrentUser({ email }));
        resolve();
      } catch (errr) {
        reject(errr);
      }

      dispatch(FinishRequest());
    });
  });
});

export const PriceReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRICE:
      return Object.assign({}, state, {
        price: action.price,
      });
    default:
      break;
  }

  return state;
};
