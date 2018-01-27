import app, { toArray } from '../shared/Firebase';

import { Platform } from 'react-native';

var storageRef = app.storage().ref("/photos/");
var photoNotesRef =  app.database().ref("/photos");

import RNFetchBlob from 'react-native-fetch-blob';
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

function genRandom() {
    return Math.floor(Math.random()*6) + '' + Math.floor(Math.random()*6) + '' + Math.floor(Math.random()*6) +
            Math.floor(Math.random()*6) + '' + Math.floor(Math.random()*6) + '' + Math.floor(Math.random()*6);
}

export const AddPhotoNote = ( photoNote ) => {
  return (dispatch)=> {
      console.log('AddPhotoNote');
      return new Promise((resolve, reject)=> {
        let uploadedImages = photoNote.images.map((image)=> {
            return new Promise((resolve, reject)=> {
                let imageName = genRandom();
                let imageRef = storageRef.child(`${imageName}`);
                let mime = 'image/jpeg';
                let uploadBlob = null;

                delete image.data;

                console.log('image', image);

                const uploadUri = Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.path;

                fs.readFile(uploadUri, 'base64')
                .then((data) => {
                    console.log('Blob.build');
                    return Blob.build(data, { type: `${mime};BASE64` });
                })
                .then((blob) => {
                    uploadBlob = blob;
                    console.log('imageRef.put');
                    return imageRef.put(blob, { contentType: mime });
                })
                .then(()=> {
                    uploadBlob.close();
                    console.log('uploadBlob.close');
                    return imageRef.getDownloadURL();
                })
                .then((url) => {
                    console.log('getDownloadURL', url);
                    resolve({ url, imageName });
                })
                .catch((error) => {
                    reject(error);
                });
            });
        });
        
        function* UploadPhotoGenerator() {
            for (let i = 0; i < uploadedImages.length; i++ ) {
                yield uploadedImages[i].then(({ url, imageName: name }) => ({ url, name }));
            }
        }
        
        let uploadOnePhoto = UploadPhotoGenerator();
        let images = [];

        function UploadTaskManager() {
            console.log('UploadTaskManager');
            let nextUpload = uploadOnePhoto.next();
            if (!nextUpload.done) {
                nextUpload.value.then(({ url, name }) => {
                    images.push({ url, name });
                    console.log('images', images);
                    UploadTaskManager();
                });
                return;
            }

            photoNote.images = images;

            photoNotesRef.push(photoNote)
            .then(()=> {
                resolve(photoNote);             
            })
            .catch(err=> {
                reject(err.message);
            });
        }

        UploadTaskManager();
        // Promise.all(uploadedImages)
        // .then(( uploadTasks )=> {

        //     photoNote.images = uploadTasks.map(()=> {
        //         return { url, name };
        //     });

        //     photoNotesRef.push(photoNote)
        //     .then(()=> {
        //         resolve(photoNote);
        //     })
        //     .catch(err=> {
        //         reject(err.message);
        //     });
        // })
        // .catch(err=>{ 
        //     reject(err.message);
        // });

      });
  }
}

export const GetPhotoNotes = ( userId ) => {
  return (dispatch)=> {
      return new Promise((resolve, reject)=> {
            let photoRef = app.database().ref("/photos").equalTo(userId).orderByChild("userId");
            photoRef.once("value", (snapshot)=> {
                let photos =  toArray(snapshot.val());
                resolve(photos);
            });
        });
    }
}