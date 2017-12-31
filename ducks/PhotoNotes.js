import app, { toArray } from '../shared/Firebase';

var storageRef = app.storage().ref("/photos/");
var photoNotesRef =  app.database().ref("/photos");

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

                imageRef.putString(image.data)
                .then((snapshot)=> {
                    resolve({snapshot, imageName});
                })
                .catch(err=> {
                    reject(err);
                });
            });
        });
        
        Promise.all(uploadedImages)
        .then(( uploadTasks )=> {

            photoNote.images = uploadTasks.map((uploadTask)=> {
                return { url:uploadTask.snapshot.downloadURL, name:uploadTask.imageName };
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