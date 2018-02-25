import app, { toArray } from 'shared/firebase';
import { StartRequest, FinishRequest } from './request';

const FACULTIES = 'FACULTIES';

const initialState = {
  faculties: {},
};

export const FacultiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FACULTIES: {
      const { universityId, data } = action;
      return Object.assign({}, state, {
        faculties: { [universityId]: data },
      });
    }

    default:
      break;
  }

  return state;
};

export const SetFaculties = (universityId, data) => {
  return {
    type: FACULTIES,
    universityId,
    data,
  };
};


export const GetFacultiesByUniversityId = universityId => (dispatch, getState) => new Promise((resolve, reject) => {
  const { facultiesState: { faculties } } = getState();
  const cached = faculties[universityId];
  if (cached) return resolve(cached);

  const facultiesRef = app
    .database()
    .ref('/faculties')
    .orderByChild('universityId')
    .equalTo(universityId);

  dispatch(StartRequest());

  facultiesRef.once('value', snapshot => {
    dispatch(SetFaculties(universityId, toArray(snapshot.val())));
    resolve(toArray(snapshot.val()));
    dispatch(FinishRequest());
  });
});
