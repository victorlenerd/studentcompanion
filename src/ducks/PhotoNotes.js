import app, { toArray } from 'shared/firebase';

import { RNS3 } from 'react-native-aws3';
import { StartRequest, FinishRequest } from 'ducks/request';

const genRandom = () => `${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}`;

export const AddPhotoNote = photoNote => dispatch => new Promise(async (resolve, reject) => {
  const photosRef = app.database().ref('/photos');

  const options = {
    keyPrefix: 'uploads/',
    bucket: 'studentcompanion',
    region: 'eu-west-2',
    accessKey: 'AKIAJRPZJKWGFMBSQ4LA',
    secretKey: '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',
    successActionStatus: 201
  };

  dispatch(StartRequest());
  const uploadsWrappers = photoNote.images.map(({ path, mime }) => {
    const name = genRandom();
    return RNS3.put({ uri: path, name, type: mime }, options)
      .then(response => {
        return { name, url: response.body.postResponse.location };
      });
  });
  const response = await Promise.all(uploadsWrappers);

  try {
    photoNote.images = response;
    await photosRef.push(photoNote);
    resolve(photoNote);
    dispatch(FinishRequest());
  } catch (err) {
    reject(err.message);
    dispatch(FinishRequest());
  }
});

export const GetPhotoNotes = userId => (dispatch, getState) => new Promise((resolve, reject) => {
  const photoRef = app
    .database()
    .ref('/photos')
    .equalTo(userId)
    .orderByChild('userId');

  dispatch(StartRequest());
  photoRef.once('value', snapshot => {
    const photos = toArray(snapshot.val()) || [];
    resolve(photos);
    dispatch(FinishRequest());
  });
});
