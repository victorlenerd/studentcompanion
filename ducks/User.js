import { AsyncStorage } from 'react-native';

import app, { toArray } from '../shared/Firebase';
import {StartRequest, FinishRequest} from './Request';

import firebase from 'firebase';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';

const GET_CURRENT_USER = "GET_CURRENT_USER";

const initialState = {
	currentUser: null
}

let usersRefs = app.database().ref('/users');


import { navigator } from '../shared/Navigation';

let _reject = (reject, dispatch)=> {
    return (err)=> {
        reject(err);
        dispatch(FinishRequest());
    }
}

let _resolve = (resolve, dispatch)=> {
    return (data)=> {
        resolve(data);
        dispatch(FinishRequest());
    }
}

export const Register = (data)=> {
    
    return (dispatch)=> {
        dispatch(StartRequest());

    	return new Promise((resolve, reject)=>{
            app.auth().createUserWithEmailAndPassword(data.email, data.password)
            .then((usr)=> {
                let usersRefs = app.database().ref('/users');
                let trialPeriod = app.database().ref('/trialPeriod');

                trialPeriod.once("value", (snapshot)=> {
                    let trialPeriod = snapshot.val();
                    let nextPaymentDate = moment().add(trialPeriod, 'days');

                    usr.sendEmailVerification()
                    .then(()=> {
                        usersRefs.push({
                            userId: usr.uid,
                            name: data.name,
                            email: data.email,
                            phoneNumber: data.phoneNumber,
                            dateAdded: new Date().toISOString(),
                            deviceId: DeviceInfo.getUniqueID(),
                            nextPaymentDate: nextPaymentDate.toISOString()
                        })
                        .then(()=>{
                            dispatch(SetCurrentUser({
                                userId: usr.uid,
                                name: data.name,
                                email: data.email
                            }))
                            .then(_resolve(resolve, dispatch))
                            .catch(_reject(reject, dispatch));
                        })
                        .catch(_reject(reject, dispatch));
                    })
                    .catch(_reject(reject, dispatch));
                    
                });
            })
            .catch(_reject(reject, dispatch));
        });
    }
}

export const Login = (data)=>  {
    return (dispatch)=> {
        dispatch(StartRequest());

    	return new Promise((resolve, reject)=>{
            app.auth().signInWithEmailAndPassword(data.email, data.password)
            .then((usr)=> {
                dispatch(SetCurrentUser({
                    userId: usr.uid,
                    name: data.name,
                    email: data.email
                }))
                .then(_resolve(resolve, dispatch))
                .catch(_reject(reject, dispatch));
            })
            .catch(_reject(reject, dispatch));
        });
    }      
}

// export const LoginWithFB = () => {
//     return (dispatch)=> {
//         return new Promise((resolve, reject)=> {
//             //Open FB Dialog
//             console.log("Open FB Dialog");
//             FBLoginManager.loginWithPermissions(["email"], function(error, data){
//                 console.log("FB-ERROR", error);
//                 if (!error) {
//                     dispatch(StartRequest());
//                     console.log("FB-DATA", data);
//                     //Get User Info From Graph
//                     fetch('https://graph.facebook.com/v2.5/me?fields=email,name&access_token=' + data.credentials.token)
//                     .then((response) => response.json())
//                     .then((json) => {
//                         console.log("FB-JSON", json);
//                         //Check If User Exist
//                         dispatch(UserExist(json.email))
//                         .then(()=> {
//                             console.log(" User Exist");
//                             //Login If User Exist
//                             dispatch(SignInWithCredential(data.credentials.token))
//                             .then((usr)=> {
//                                 //Set Current User
//                                 console.log("Current User");
//                                 dispatch(SetCurrentUser({
//                                     userId: usr.uid,
//                                     name: usr.displayName,
//                                     email: usr.email
//                                 }))
//                                 .then(_resolve(resolve, dispatch)) 
//                                 .catch(_reject(reject, dispatch));
//                             })
//                             .catch(_reject(reject, dispatch));

//                         })
//                         .catch(()=> {
//                             console.log("User does not exist");
//                             dispatch(SignInWithCredential(data.credentials.token))
//                             .then((usr)=> {
//                                 usersRefs.push({
//                                     userId: usr.uid,
//                                     name: usr.displayName,
//                                     email: usr.email,
//                                     paid: false,
//                                     deviceId: DeviceInfo.getUniqueID()
//                                 })
//                                 .then((usr)=> {
//                                     //Set Current User
//                                     dispatch(SetCurrentUser({
//                                         userId: usr.uid,
//                                         name: usr.displayName,
//                                         email: usr.email
//                                     }))
//                                     .then(_resolve(resolve, dispatch)) 
//                                     .catch(_reject(reject, dispatch));
//                                 })
//                                 .catch(_reject(reject, dispatch));
//                             });

//                         });
//                     })
//                     .catch(_reject(reject, dispatch));
//                 } else {
//                     reject(error);
//                 }
//             });         
//         });
//     }
// }

// export const SignInWithCredential =(token)=> {
//     return (dispatch)=> {
//         return new Promise((resolve, reject)=> {
//             let credential = new firebase.auth.FacebookAuthProvider.credential(token);

//             app.auth().signInWithCredential(credential)
//             .then((data)=> {
//                 resolve(data);
//             })
//             .catch((error)=> {
//                 reject(error);
//             });
//         });
//     }    
// }

export const SendResetPasswordEmail =(email)=> {
    return (dispatch)=> {
        dispatch(StartRequest());
        return new Promise((resolve, reject)=> {
            app.auth().sendPasswordResetEmail(email)
            .then((data)=> {
                resolve(data);
                dispatch(FinishRequest());
            })
            .catch((error)=> {
                reject(error);
                dispatch(FinishRequest());
            });     
        });
    }
}

export const UserExist = (email)=> {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            let usersRefs = app.database().ref('/users');
            usersRefs.orderByChild("email").equalTo(email)
            .on("value", ( snapshot )=> {
                let value = toArray(snapshot.val());
                if (value.length < 1) {
                    reject();
                } else {
                    resolve(value);
                }
            });

        });
    }
}

export const SetCurrentUser = (data) => {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            usersRefs.orderByChild("email").equalTo(data.email)
            .on("value", ( snapshot )=> {
                let user = toArray(snapshot.val())[0];
                AsyncStorage.setItem("@UPQ:CURRENT_USER", JSON.stringify(user))
                .then(()=> {
                    resolve();
                })
                .catch((err)=> {
                    reject(err);
                });
            });
        });
    }
}

export const GetCurrentUser = () => {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {

            AsyncStorage.getItem("@UPQ:CURRENT_USER")
            .then(( saved_data  )=> {
                let user = JSON.parse(saved_data);

                usersRefs.orderByChild("email").equalTo(user.email)
                .on("value", ( snapshot )=> {
                    let user = toArray(snapshot.val())[0];

                    if (user !== null) {
                        AsyncStorage.setItem("@UPQ:CURRENT_USER", JSON.stringify(user))
                        .then(()=> {
                            resolve(user);
                        })
                        .catch((err)=> {
                            reject(err);
                        });
                    } else {
                        dispatch(DeleteCurrentUser())
                        .then(()=> {
                             navigator.welcome();
                        });
                    }
                });
            })
            .catch((err)=> {
                reject({ message: "No user" });
            });
        });
    }
}

export const GetCurrentUserOffline = (data) => {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            AsyncStorage.getItem("@UPQ:CURRENT_USER")
            .then(( saved_data  )=> {
                let user = JSON.parse(saved_data);            
                resolve(user);
            })
            .catch((err)=> {
                reject({ message: "No Logged In User" });
            });
        });
    }
}

export const DeleteCurrentUser = () => {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            AsyncStorage.removeItem("@UPQ:CURRENT_USER")
            .then(( saved_data  )=> {
                resolve(true);
            })
            .catch((err)=> {
                reject(err);
            });    
        })
    }
  
}

export const SignOut = () => {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            app.auth().signOut().then(()=> {
                dispatch(DeleteCurrentUser())
                .then(()=> {
                    AsyncStorage.removeItem("@UPQ:OFFLINE_COURSES")
                    .then(()=> {
                        resolve();
                    })
                    .catch((err)=> {
                        reject(err);
                    });
                },(err)=> {
                    reject(err);
                });
            }, (err)=> {
                reject(err);
            });
        });
    }
}

export const SendDeviceActivationCode = (email) => {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            fetch('https://victor-com-ng.appspot.com/send_device_activate_code_upq',{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to_email: email
                })
            })
            .then((response) => response.json())
            .then((json) => {
                let ref = usersRefs.orderByChild("email").equalTo(email);
                ref.once("value", (snapshot) => {
                    var usr = toArray(snapshot.val())[0];
                    userRef = app.database().ref(`/users/${usr.$id}`)
                    userRef.update({"deviceActivationCode": json.code}, (err)=> {
                        if (err !== null) reject(err);
                        dispatch(SetCurrentUser({email}))
                        .then(()=> {
                            resolve();
                        })
                        .catch((err)=> {
                            reject(err);
                        });
                    });
                });
            })
            .catch((err)=> {
                reject(err);
            });
        });
    }
}

export const UpdateUserDeviceId = (code)=> {
    return (dispatch) => {
        return new Promise((resolve, reject)=> {
            dispatch(GetCurrentUser())
            .then((user)=> {
                userRef = app.database().ref(`/users/${user.$id}`)
                if (user.deviceActivationCode == code) {
                    userRef.update({"deviceId": DeviceInfo.getUniqueID(), "deviceActivationCode": null}, (err)=> {
                        if (err !== null) reject(err);
                            dispatch(SetCurrentUser(user))
                            .then(()=> {
                                resolve();
                            })
                            .catch((err)=> {
                                reject(err);
                            });
                    });
                } else {
                    reject({
                        message: "Code is incorrect."
                    })
                }
            })
            .catch(reject);
      });
    }
}

export const SetAcademicInfo = (userId, academicInfo)=> {
    return (dispatch) => {
        return new Promise((resolve, reject)=> {
            dispatch(GetCurrentUser())
            .then((user)=> {
                userRef = app.database().ref(`/users/${userId}`)

                userRef.update({
                    universityId: academicInfo.universityId,
                    facultyId: academicInfo.facultyId,
                    departmentId: academicInfo.departmentId,
                    levelId: academicInfo.levelId
                }, (err)=> {
                    if (err !== null) reject(err);
                    dispatch(SetCurrentUser(user))
                    .then(()=> {
                        resolve();
                    })
                    .catch((err)=> {
                        reject(err);
                    });
                });
            })
            .catch(reject);
      });
    }
}

export const TransferRequest = (userId, amount, approvedPhotoNotes) => {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            let photoNotesRef =  app.database().ref(`/photos/`);
            let tRef = app.database().ref('/transferRequest');

            approvedPhotoNotes.map(( photoNote )=>{
                return new Promise((resolve, reject)=> {
                    let photoNoteRef = photoNotesRef.child(photoNote.$id);
                    photoNoteRef.remove()
                    .then(resolve)
                    .catch(reject);
                });
            });

            Promise.all(approvedPhotoNotes)
            .then(()=> {
                tRef.push({
                    userId, 
                    amount,
                    dateAdded: new Date().toISOString()
                })
                .then(()=> {
                    let userPhotoRef = app.database().ref(`/photos/`).equalTo(userId).orderByChild("userId");
                    photoNotesRef.on('value', (snapshot)=> {                        
                        let photos =  toArray(snapshot.val());
                        resolve(photos);
                    });
                })
                .catch(reject);
            })
            .catch(reject);
        });
    }
}