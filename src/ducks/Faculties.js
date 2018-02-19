import app, { toArray } from 'shared/firebase';
import { StartRequest, FinishRequest } from './request';

const FACULTIES = 'FACULTIES';

const initialState = {
  faculties: [],
};

export const FacultiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FACULTIES:
      return Object.assign({}, state, {
        faculties: action.data,
      });
    default:
      break;
  }

  return state;
};

export const SetFaculties = data => {
  return {
    type: FACULTIES,
    data,
  };
};

export const GetFaculties = () => dispatch => new Promise((resolve, reject) => {
  const facultiesRef = app.database().ref('/faculties');
  dispatch(StartRequest());
  facultiesRef.once('value', snapshot => {
    dispatch(SetFaculties(toArray(snapshot.val())));
    resolve(snapshot.val());
    dispatch(FinishRequest());
  });
});

export const GetFacultiesByUniversityId = universityId => dispatch => new Promise((resolve, reject) => {
  const facultiesRef = app
    .database()
    .ref('/faculties')
    .orderByChild('universityId')
    .equalTo(universityId);

  dispatch(StartRequest());

  facultiesRef.once('value', snapshot => {
    dispatch(SetFaculties(toArray(snapshot.val())));
    resolve(toArray(snapshot.val()));
    dispatch(FinishRequest());
  });
});
