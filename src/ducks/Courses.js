import { AsyncStorage } from 'react-native';

import filter from 'lodash/filter';
import app, { toArray } from 'shared/firebase';
import { StartRequest, FinishRequest } from './request';

const COURSES = 'COURSES';
const SET_CURRENT_COURSE = 'SET_CURRENT_COURSE';
const SAVED_COURSES = 'SAVED_COURSES';

const initialState = {
  currentCourse: {},
  coursesById: {},
  library: []
};

export const GetCourse = courseId => dispatch => new Promise((resolve, reject) => {
  dispatch(StartRequest());
  const coursesRef = app
    .database()
    .ref(`/courses/${courseId}`);

  coursesRef.once('value', snapshot => {
    const course = toArray(snapshot.val());
    resolve(course);
    dispatch(FinishRequest());
  });
});

export const GetCoursesByOtherId = (idName, dbId) => (dispatch, getState) => new Promise((resolve, reject) => {
  const { courseState: { coursesById } } = getState();
  const cached = coursesById[dbId];
  if (cached) return resolve(cached);

  dispatch(StartRequest());
  const coursesRef = app
    .database()
    .ref('/courses')
    .orderByChild(idName)
    .equalTo(dbId);

  coursesRef.once('value', snapshot => {
    const courses = toArray(snapshot.val());
    dispatch(SetCourses(dbId, courses));
    resolve(courses);
    dispatch(FinishRequest());
  });
});

export const GetCoursesOffline = () => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const { courseState: { library } } = getState();
  if (library.length > 0) return resolve(library);

  dispatch(StartRequest());
  try {
    const saved_courses = await AsyncStorage.getItem('@UPQ:OFFLINE_COURSES');
    if (saved_courses !== null) {
      dispatch(SetLibrary(JSON.parse(saved_courses)));
      resolve(JSON.parse(saved_courses));
    } else {
      resolve([]);
    }
  } catch (err) {
    reject(err.message);
  }

  dispatch(FinishRequest());
});

export const SaveCourseOffline = course => dispatch => new Promise(async (resolve, reject) => {
  dispatch(StartRequest());
  const courses = await dispatch(GetCoursesOffline());
  const match = filter(courses, c => {
    if (c.$id === course.$id) return course;
  });

  if (match.length < 1) {
    courses.push(course);
  } else {
    courses[Object.keys(course)[0]] = course;
  }

  dispatch(SetLibrary(courses));

  try {
    await AsyncStorage.setItem('@UPQ:OFFLINE_COURSES', JSON.stringify(courses));
    resolve(course);
  } catch (err) {
    reject(err.message);
  }

  dispatch(FinishRequest());
});

export const RemoveCourseOffline = courseId => dispatch => new Promise(async (resolve, reject) => {
  dispatch(StartRequest());
  const courses = await dispatch(GetCoursesOffline());
  const newCourses = courses.filter(c => c.id !== courseId);

  dispatch(SetLibrary(newCourses));

  try {
    await AsyncStorage.setItem('@UPQ:OFFLINE_COURSES', JSON.stringify(newCourses));
    resolve(course);
  } catch (err) {
    reject(err.message);
  }

  dispatch(FinishRequest());
});

export const SetCourses = (id, courses) => {
  return {
    type: COURSES,
    typeId: id,
    courses,
  };
};

export const SetLibrary = courses => {
  return {
    type: SAVED_COURSES,
    courses,
  };
};

export const SetCurrentCourse = course => {
  return {
    type: SET_CURRENT_COURSE,
    course
  };
};

export const CourseReducer = (state = initialState, action) => {
  switch (action.type) {
    case COURSES: {
      const { typeId, courses } = action;
      return Object.assign({}, state, {
        coursesById: { [typeId]: courses },
      });
    }
    case SAVED_COURSES:
      return Object.assign({}, state, {
        library: action.courses,
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
