import app, { toArray } from 'shared/firebase';

import { RNS3 } from 'react-native-aws3';
import { StartRequest, FinishRequest } from 'ducks/request';

const genRandom = () => `${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}`;

export const AddPhotoNote = photoNote => dispatch => new Promise(async (resolve, reject) => {
  // const uploadedImages = photoNote.images.map(image => new Promise(async (res, rej) => {
  //   const imageName = genRandom();
  //   const imageRef = storageRef.child(`${imageName}`);
  //   const mime = 'image/jpeg';

  //   delete image.data;
  //   const uploadUri = Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.path;

  //   try {
  //     const data = await fs.readFile(uploadUri, 'base64');
  //     const blob = await Blob.build(data, { type: `${mime};BASE64` });
  //     await imageRef.put(blob, { contentType: mime });
  //     const url = await imageRef.getDownloadURL();
  //     blob.close();
  //     res({ url, imageName });
  //   } catch (err) {
  //     rej(err);
  //   }
  // }));
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

  // function* UploadPhotoGenerator() {
  //   for (let i = 0; i < uploadedImages.length; i += 1) {
  //     yield uploadedImages[i].then(({ url, imageName: name }) => ({ url, name }));
  //   }
  // }

  // const uploadOnePhoto = UploadPhotoGenerator();
  // const images = [];

  // async function UploadTaskManager() {
  //   const nextUpload = uploadOnePhoto.next();
  //   if (!nextUpload.done) {
  //     nextUpload.value.then(({ url, name }) => {
  //       images.push({ url, name });
  //       UploadTaskManager();
  //     });
  //     return;
  //   }

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

export const GetPhotoNotes = userId => dispatch => new Promise((resolve, reject) => {
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
