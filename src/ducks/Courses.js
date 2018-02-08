import { AsyncStorage } from 'react-native';

import find from 'lodash/find';
import app, { toArray } from 'shared/firebase';
import { StartRequest, FinishRequest } from './request';

const COURSES = 'COURSES';
const SET_CURRENT_COURSE = 'SET_CURRENT_COURSE';

const initialState = {
  currentCourse: {},
  courses: [],
};

export const GetCourses = () => dispatch => new Promise((resolve, reject) => {
  dispatch(StartRequest());
  const coursesRef = app.database().ref('/courses');
  coursesRef.once('value', snapshot => {
    dispatch(SetCourses(toArray(snapshot.val())));
    resolve();
    dispatch(FinishRequest());
  });
});

export const GetCoursesByDepartmentId = departmentId => dispatch => new Promise((resolve, reject) => {
  const coursesRef = app
    .database()
    .ref('/courses')
    .orderByChild('departmentId')
    .equalTo(departmentId);

  dispatch(StartRequest());

  coursesRef.once('value', snapshot => {
    resolve(toArray(snapshot.val()));
    dispatch(FinishRequest());
  });
});

export const GetCoursesByOtherId = (idName, dbId) => dispatch => new Promise((resolve, reject) => {
  dispatch(StartRequest());
  const coursesRef = app
    .database()
    .ref('/courses')
    .orderByChild(idName)
    .equalTo(dbId);

  coursesRef.once('value', snapshot => {
    resolve(toArray(snapshot.val()));
    dispatch(FinishRequest());
  });
});

export const GetCoursesOffline = () => dispatch => new Promise(async (resolve, reject) => {
  dispatch(StartRequest());
  try {
    const saved_courses = await AsyncStorage.getItem('@UPQ:OFFLINE_COURSES');
    if (saved_courses !== null) {
      resolve(JSON.parse(saved_courses));
    } else {
      resolve([]);
    }
  } catch (err) {
    reject(err.message);
  }

  dispatch(FinishRequest());
});

export const SaveCourseOffline = course => dispatch => new Promise((resolve, reject) => {
  dispatch(StartRequest());
  dispatch(GetCoursesOffline()).then(async courses => {
    const match = find(courses, (c, index) => (c.$id === course.$id));

    if (match.length < 1) {
      courses.push(course);
    } else {
      courses[Object.keys(course)[0]] = course;
    }

    try {
      await AsyncStorage.setItem('@UPQ:OFFLINE_COURSES', JSON.stringify(courses));
      resolve(course);
    } catch (err) {
      reject(err.message);
    }

    dispatch(FinishRequest());
  });
});

export const SetCourses = courses => {
  return {
    type: COURSES,
    courses,
  };
};

export const SetCurrentCourse = course => {
  return {
    type: SET_CURRENT_COURSE,
    course,
  };
};

export const CourseReducer = (state = initialState, action) => {
  switch (action.type) {
    case COURSES:
      return Object.assign({}, state, {
        courses: action.courses,
      });
    case SET_CURRENT_COURSE:
      return Object.assign({}, state, {
        currentCourse: action.course,
      });
    default:
      break;
  }

  return state;
};
