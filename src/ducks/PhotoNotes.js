import app, { toArray } from 'shared/firebase';

import { RNS3 } from 'react-native-aws3';
import { StartRequest, FinishRequest } from 'ducks/request';

const SET_UPLOADED_PHOTOS = 'SET_UPLOADED_PHOTOS';

const initialState = {
  uploads: [],
};

const genRandom = () => `${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}`;

export const AddPhotoNote = photoNote => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const { uploadPhotosState: { uploads } } = getState();

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
    dispatch({
      type: SET_UPLOADED_PHOTOS,
      uploads: uploads.concat(photoNote)
    });
    resolve(photoNote);
    dispatch(FinishRequest());
  } catch (err) {
    reject(err.message);
    dispatch(FinishRequest());
  }
});

export const GetPhotoNotes = userId => (dispatch, getState) => new Promise((resolve, reject) => {
  const { uploadPhotosState: { uploads } } = getState();
  dispatch(StartRequest());

  if (uploads.length > 1) {
    resolve(uploads);
    dispatch(FinishRequest());
    return;
  }

  const photoRef = app
    .database()
    .ref('/photos')
    .equalTo(userId)
    .orderByChild('userId');

  photoRef.once('value', snapshot => {
    const photos = toArray(snapshot.val()) || [];
    dispatch({
      type: SET_UPLOADED_PHOTOS,
      uploads: photos
    });
    resolve(photos);
    dispatch(FinishRequest());
  });
});


export const UploadPhotosReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_UPLOADED_PHOTOS:
      return { uploads: action.uploads };
    default:
      break;
  }

  return state;
};
