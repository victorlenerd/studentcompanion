import firebase from 'react-native-firebase';

const app = firebase;

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
