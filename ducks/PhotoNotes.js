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
      return new Promise((resolve, reject)=> {
        let uploadedImages = photoNote.images.map((image)=> {
            return new Promise((resolve, reject)=> {
                let imageName = genRandom();
                let imageRef = storageRef.child(`${imageName}`);
                let mime = 'image/jpeg';
                let uploadBlob = null;
            
                const uploadUri = Platform.OS === 'ios' ? image.path.replace('file://', '') : image.path;

                fs.readFile(uploadUri, 'base64')
                .then((data) => {
                    return Blob.build(data, { type: `${mime};BASE64` });
                })
                .then((blob) => {
                    uploadBlob = blob;
                    return imageRef.put(blob, { contentType: mime });
                })
                .then(()=> {
                    uploadBlob.close();
                    return imageRef.getDownloadURL();
                })
                .then((url) => {
                    resolve({ url, imageName });
                })
                .catch((error) => {
                    reject(error);
                });
            });
        });
        
        Promise.all(uploadedImages)
        .then(( uploadTasks )=> {

            photoNote.images = uploadTasks.map(({ url, imageName: name })=> {
                return { url, name };
            });

            photoNotesRef.push(photoNote)
            .then(()=> {
                resolve(photoNote);
            })
            .catch(err=> {
                reject(err.message);
            });
        })
        .catch(err=>{ 
            reject(err.message);
        });
      });
  }
}

export const GetPhotoNotes = ( userId ) => {
  return (dispatch)=> {
      return new Promise((resolve, reject)=> {
            let photoRef = app.database().ref("/photos").equalTo(userId).orderByChild("userId");
            photoRef.on("value", (snapshot)=> {
                let photos =  toArray(snapshot.val());
                resolve(photos);
            });
        });
    }
}