import moment from 'moment';

const SET_PRICE = 'SET_PRICE';
const SET_PER_PHOTO = 'SET_PER_PHOTO';
const SET_MONTH_PHOTO = 'SET_PRICE_MONTH';
const SET_QUATER_PHOTO = 'SET_PRICE_QUATER';
const SET_YEAR_PHOTO = 'SET_PRICE_YEAR';

let initialState = {
    price: 0,
    pricePerPhoto: 0,
    pricePerMonth: 0, 
    pricePerQuater: 0, 
    pricePerYear: 0
};

import app, { toArray } from '../shared/Firebase';
import {StartRequest, FinishRequest} from './Request';
import { SetCurrentUser } from './User';

let usersRefs = app.database().ref('/users');

export const SetPricePerPhoto = ( price ) => {
    return {
        type: SET_PRICE,
        price
    }
}

export const SetPricePerMonth = ( price ) => {
    return {
        type: SET_PER_MONTH,
        price
    }
}

export const SetPricePerQuarter = ( price ) => {
    return {
        type: SET_PER_QUATER,
        price
    }
}
export const SetPricePerYear = ( price ) => {
    return {
        type: SET_PER_YEAR,
        price
    }
}


export const GetPrice = () => {
    return (dispatch)=> {
        dispatch(StartRequest());

        return new Promise((resolve, reject)=> {
            let priceRef = app.database().ref("/price");

            priceRef.on("value", (snapshot)=> {
                dispatch(SetPrice(snapshot.val()));
                dispatch(FinishRequest());
                resolve();
            });
        });
    }
}

export const GetPricePerPhoto = () => {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            let pricePerPhotoRef = app.database().ref("/pricePerPhoto");

            pricePerPhotoRef.on("value", (snapshot)=> {
                dispatch(SetPricePerPhoto(snapshot.val()));

                console.log();
                resolve(snapshot.val());
            });
        });
    }
}

export const MakePayment = (email, amount) => {
    return (dispatch)=> {
        dispatch(StartRequest());

        return new Promise((resolve, reject)=> {
            let ref = usersRefs.orderByChild("email").equalTo(email);

            ref.once("value", (snapshot) => {
                var usr = toArray(snapshot.val())[0];
                var now = moment(), numberOfDays, newNextPaymentDate;
                var userRef = app.database().ref(`/users/${usr.$id}`);
                
                if (amount === 10000) {
                    numberOfDays = 31;
                } 
                
                if (amount === 100000)  {
                    numberOfDays = 365;
                }
                
                newNextPaymentDate = now.add(numberOfDays, 'days')

                userRef.update({
                    nextPaymentDate: newNextPaymentDate.toISOString()
                }, (err)=> {
                    if (err !== null) reject(err);
                    dispatch(SetCurrentUser({email}))
                    .then(()=> {
                        resolve();
                        dispatch(FinishRequest());
                    })
                    .catch((err)=> {
                        reject(err);
                    });
                });
            });

        });
    }
}

export const SetFreeCourseId = (email, courseId) => {
    return (dispatch)=> {
        dispatch(StartRequest());

        return new Promise((resolve, reject)=> {
            let ref = usersRefs.orderByChild("email").equalTo(email);

            ref.once("value", (snapshot) => {
                var usr = toArray(snapshot.val())[0];
                userRef = app.database().ref(`/users/${usr.$id}`)
                userRef.update({"freeCourseId": courseId}, (err)=> {
                    if (err !== null) reject(err);
                    dispatch(SetCurrentUser({email}))
                    .then(()=> {
                        resolve();
                        dispatch(FinishRequest());
                    })
                    .catch((err)=> {
                        reject(err);
                    });
                });
            });

        });
    }
}

export const PriceReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_PRICE:
            return Object.assign({}, state, {
                price: action.price
            });
        default:
            break;
    }

    return state;
}
