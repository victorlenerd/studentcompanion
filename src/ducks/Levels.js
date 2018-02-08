import app, { toArray } from 'shared/firebase';
import { StartRequest, FinishRequest } from './request';

const LEVELS = 'LEVELS';

const initialState = {
  levels: [],
};

export const LevelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LEVELS:
      return Object.assign({}, state, {
        levels: action.data,
      });
    default:
      break;
  }

  return state;
};

export const SetLevels = data => {
  return {
    type: LEVELS,
    data,
  };
};

export const GetLevels = () => dispatch => new Promise((resolve, reject) => {
  const levelsRef = app.database().ref('/levels');
  dispatch(StartRequest());
  levelsRef.once('value', snapshot => {
    dispatch(SetLevels(toArray(snapshot.val())));
    resolve(snapshot.val());
    dispatch(FinishRequest());
  });
});

export const GetLevelsByDepartmentId = departmentId => dispatch => new Promise((resolve, reject) => {
  const levelsRef = app
    .database()
    .ref('/levels')
    .orderByChild('departmentId')
    .equalTo(departmentId);

  dispatch(StartRequest());

  levelsRef.once('value', snapshot => {
    resolve(toArray(snapshot.val()));
    dispatch(FinishRequest());
  });
});
