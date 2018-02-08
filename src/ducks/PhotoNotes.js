import { Platform } from 'react-native';
import app, { toArray } from 'shared/firebase';
import RNFetchBlob from 'react-native-fetch-blob';

import { StartRequest, FinishRequest } from './request';

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const storageRef = app.storage().ref('/photos/');
const photoNotesRef = app.database().ref('/photos');

const { polyfill: { Blob }, fs } = RNFetchBlob;

const genRandom = () => `${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}`;

export const AddPhotoNote = photoNote => dispatch => new Promise((resolve, reject) => {
  const uploadedImages = photoNote.images.map(image => new Promise(async (res, rej) => {
    const imageName = genRandom();
    const imageRef = storageRef.child(`${imageName}`);
    const mime = 'image/jpeg';

    delete image.data;
    const uploadUri = Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.path;

    try {
      const data = await fs.readFile(uploadUri, 'base64');
      const blob = await Blob.build(data, { type: `${mime};BASE64` });
      await imageRef.put(blob, { contentType: mime });
      const url = await imageRef.getDownloadURL();
      blob.close();
      res({ url, imageName });
    } catch (err) {
      rej(err);
    }
  }));

  function* UploadPhotoGenerator() {
    for (let i = 0; i < uploadedImages.length; i += 1) {
      yield uploadedImages[i].then(({ url, imageName: name }) => ({ url, name }));
    }
  }

  const uploadOnePhoto = UploadPhotoGenerator();
  const images = [];

  async function UploadTaskManager() {
    const nextUpload = uploadOnePhoto.next();
    if (!nextUpload.done) {
      nextUpload.value.then(({ url, name }) => {
        images.push({ url, name });
        UploadTaskManager();
      });
      return;
    }

    try {
      photoNote.images = images;
      await photoNotesRef.push(photoNote)
      resolve(photoNote);
      dispatch(FinishRequest());
    } catch (err) {
      reject(err.message);
    }
  }

  dispatch(StartRequest());
  UploadTaskManager();
});

export const GetPhotoNotes = userId => dispatch => new Promise((resolve, reject) => {
  const photoRef = app
    .database()
    .ref('/photos')
    .equalTo(userId)
    .orderByChild('userId');

  dispatch(StartRequest());
  photoRef.once('value', snapshot => {
    const photos = toArray(snapshot.val());
    resolve(photos);
    dispatch(FinishRequest());
  });
});
