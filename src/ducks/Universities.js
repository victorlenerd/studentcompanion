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

export const GetUniversities = () => (dispatch, getState) => new Promise((resolve, reject) => {
  const { universitiesState: { universities } } = getState();
  if (universities.length > 0) return resolve(universities);
  const universitiesRef = app.database().ref('/universities');
  dispatch(StartRequest());
  universitiesRef.once('value', snapshot => {
    dispatch(SetUniversities(toArray(snapshot.val())));
    dispatch(FinishRequest());
    resolve(toArray(snapshot.val()));
  });
});
