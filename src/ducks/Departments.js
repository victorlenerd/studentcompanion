import app, { toArray } from 'shared/firebase';
import { StartRequest, FinishRequest } from './request';

const DEPARTMENTS = 'DEPARTMENTS';

const initialState = {
  departments: [],
};

export const DepartmentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DEPARTMENTS:
      return Object.assign({}, state, {
        departments: action.data,
      });
    default:
      break;
  }

  return state;
};

export const SetDepartments = data => {
  return {
    type: DEPARTMENTS,
    data,
  };
};

export const GetDepartments = () => dispatch => new Promise((resolve, reject) => {
  const departmentsRef = app.database().ref('/departments');
  dispatch(StartRequest());
  departmentsRef.once('value', snapshot => {
    dispatch(SetDepartments(toArray(snapshot.val())));
    resolve(snapshot.val());
    dispatch(FinishRequest());
  });
});

export const GetDepartmentsByFacultyId = facultyId => dispatch => new Promise((resolve, reject) => {
  dispatch(StartRequest());
  const departmentsRef = app
    .database()
    .ref('/departments')
    .orderByChild('facultyId')
    .equalTo(facultyId);

  departmentsRef.once('value', snapshot => {
    resolve(toArray(snapshot.val()));
    dispatch(FinishRequest());
  });
});
