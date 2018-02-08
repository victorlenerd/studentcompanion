import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyCW2RHrPANno3EynMTAgoa64OlGFnd86Nw',
  authDomain: 'unilagpastquestions-com.firebaseapp.com',
  databaseURL: 'https://unilagpastquestions-com.firebaseio.com',
  storageBucket: 'unilagpastquestions-com.appspot.com',
  messagingSenderId: '797802251503',
};

const app = firebase.initializeApp(firebaseConfig);

export const toArray = obj => {
  if (obj === null) return data;

  const keys = Object.keys(obj);

  const data = keys.map(k => {
    const entity = obj[k];
    entity.$id = k;
    return entity;
  });

  return data;
};

export default app;
