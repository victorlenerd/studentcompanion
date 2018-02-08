import app, { toArray } from 'shared/firebase';
import { StartRequest, FinishRequest } from './request';

const UNIVERSITIES = 'UNIVERSITIES';

const initialState = {
  universities: [],
};

export const UniversitiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case UNIVERSITIES:
      return Object.assign({}, state, {
        universities: action.data,
      });
    default:
      break;
  }

  return state;
};

export const SetUniversities = data => {
  return {
    type: UNIVERSITIES,
    data,
  };
};

export const GetUniversities = () => dispatch => new Promise((resolve, reject) => {
  const universitiesRef = app.database().ref('/universities');
  dispatch(StartRequest());
  universitiesRef.once('value', snapshot => {
    dispatch(SetUniversities(toArray(snapshot.val())));
    resolve(toArray(snapshot.val()));
    dispatch(FinishRequest());
  });
});
