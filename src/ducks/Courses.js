import { NetInfo, AsyncStorage } from 'react-native';

import app, { toArray } from '../shared/Firebase';
import { StartRequest, FinishRequest } from './Request';

const COURSES = 'COURSES';
const SET_CURRENT_COURSE = 'SET_CURRENT_COURSE';

let initialState = {
  currentCourse: {},
  courses: [],
};

export const GetCourses = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let coursesRef = app.database().ref('/courses');
      coursesRef.once('value', snapshot => {
        dispatch(SetCourses(toArray(snapshot.val())));
        resolve();
      });
    });
  };
};

export const GetCoursesByDepartmentId = departmentId => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let coursesRef = app
        .database()
        .ref('/courses')
        .orderByChild('departmentId')
        .equalTo(departmentId);
      coursesRef.once('value', snapshot => {
        resolve(toArray(snapshot.val()));
      });
    });
  };
};

export const GetCoursesByOtherId = (idName, dbId) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let coursesRef = app
        .database()
        .ref('/courses')
        .orderByChild(idName)
        .equalTo(dbId);
      coursesRef.once('value', snapshot => {
        resolve(toArray(snapshot.val()));
      });
    });
  };
};

export const GetCoursesOffline = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('@UPQ:OFFLINE_COURSES')
        .then(function(saved_courses) {
          if (saved_courses !== null) {
            resolve(JSON.parse(saved_courses));
          } else {
            resolve([]);
          }
        })
        .catch(function(err) {
          reject(err.message);
        });
    });
  };
};

export const SaveCourseOffline = course => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch(GetCoursesOffline()).then(courses => {
        var matchIndex;
        let match = courses.filter((c, index) => {
          if (c.$id == course.$id) {
            matchIndex = index;
            return c;
          }
        });

        if (match.length < 1) {
          courses.push(course);
        } else {
          courses[matchIndex] = course;
        }

        AsyncStorage.setItem(`@UPQ:OFFLINE_COURSES`, JSON.stringify(courses))
          .then(function() {
            resolve(course);
          })
          .catch(function(err) {
            reject(err.message);
          });
      });
    });
  };
};

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
