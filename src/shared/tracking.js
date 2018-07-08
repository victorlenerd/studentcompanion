import firebase from 'react-native-firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyCW2RHrPANno3EynMTAgoa64OlGFnd86Nw',
  authDomain: 'unilagpastquestions-com.firebaseapp.com',
  databaseURL: 'https://unilagpastquestions-com.firebaseio.com',
  storageBucket: 'unilagpastquestions-com.appspot.com',
  messagingSenderId: '797802251503',
};

const app = firebase.initializeApp(firebaseConfig);

export default app.analytics();
