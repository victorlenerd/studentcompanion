import app, { toArray } from 'shared/firebase';
import { StartRequest, FinishRequest } from './request';

const DEPARTMENTS = 'DEPARTMENTS';

const initialState = {
  departments: {},
};

export const DepartmentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DEPARTMENTS: {
      const { facultyId, data } = action;
      return Object.assign({}, state, {
        departments: { [facultyId]: data },
      });
    }
    default:
      break;
  }

  return state;
};

export const SetDepartments = (facultyId, data) => {
  return {
    type: DEPARTMENTS,
    facultyId,
    data
  };
};

export const GetDepartmentsByFacultyId = facultyId => (dispatch, getState) => new Promise((resolve, reject) => {
  const { departmentsState: { departments } } = getState();
  const cached = departments[facultyId];
  if (cached) return resolve(cached);

  dispatch(StartRequest());
  const departmentsRef = app
    .database()
    .ref('/departments')
    .orderByChild('facultyId')
    .equalTo(facultyId);

  departmentsRef.once('value', snapshot => {
    resolve(toArray(snapshot.val()));
    dispatch(SetDepartments(facultyId, toArray(snapshot.val())));
    dispatch(FinishRequest());
  });
});
