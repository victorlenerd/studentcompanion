import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCW2RHrPANno3EynMTAgoa64OlGFnd86Nw",
    authDomain: "unilagpastquestions-com.firebaseapp.com",
    databaseURL: "https://unilagpastquestions-com.firebaseio.com",
    storageBucket: "unilagpastquestions-com.appspot.com",
    messagingSenderId: "797802251503"
};

const app = firebase.initializeApp(firebaseConfig);

export const toArray = (obj)=> {
    let data = [];

    if (obj === null) return data;

    for (let o in obj) {
        let entity = obj[o]
        entity.$id = o;
        data.push(entity);
    }

    return data;
}

export default app;
