import app, { toArray } from 'shared/firebase';
import { StartRequest, FinishRequest } from './request';

const LEVELS = 'LEVELS';

const initialState = {
  levels: {},
};

export const LevelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LEVELS: {
      const { departmentId, data } = action;
      return Object.assign({}, state, {
        levels: { [departmentId]: data },
      });
    }
    default:
      break;
  }

  return state;
};

export const SetLevels = (departmentId, data) => {
  return {
    type: LEVELS,
    departmentId,
    data,
  };
};

export const GetLevelsByDepartmentId = departmentId => (dispatch, getState) => new Promise((resolve, reject) => {
  const { levelsState: { levels } } = getState();
  const cached = levels[departmentId];
  if (cached) return resolve(cached);

  const levelsRef = app
    .database()
    .ref('/levels')
    .orderByChild('departmentId')
    .equalTo(departmentId);

  dispatch(StartRequest());

  levelsRef.once('value', snapshot => {
    resolve(toArray(snapshot.val()));
    dispatch(SetLevels(departmentId, toArray(snapshot.val())));
    dispatch(FinishRequest());
  });
});
