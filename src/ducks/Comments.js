import app, { toArray } from 'shared/firebase';
import { StartRequest, FinishRequest } from './request';

export const GetComments = (type, typeId) => dispatch => new Promise((resolve, reject) => {
  const typeCommentsRef = app
    .database()
    .ref('comments/')
    .equalTo(typeId)
    .orderByChild(`${type}Id`);

  dispatch(StartRequest());

  typeCommentsRef.once(
    'value',
    snapshot => {
      dispatch(FinishRequest());
      resolve(toArray(snapshot.val()));
    },
    err => {
      dispatch(FinishRequest());
      reject(err);
    });
});

export const PostComments = comment => dispatch => new Promise((resolve, reject) => {
  const commentsRef = app.database().ref('comments/');
  dispatch(StartRequest());

  commentsRef
    .push(comment)
    .then(() => {
      resolve(comment);
      dispatch(FinishRequest());
    })
    .catch(err => {
      reject(err);
      dispatch(FinishRequest());
    });
});

