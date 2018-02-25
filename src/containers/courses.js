import { connect } from 'react-redux';
import { GetCoursesByOtherId, GetCoursesOffline, SaveCourseOffline, SetCurrentCourse } from 'ducks/courses';

const mapStateToProps = store => {
  return {
    currentCourse: store.courseState.currentCourse,
    courses: store.courseState.courses
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCoursesOffline: () => dispatch(GetCoursesOffline()),
    getCoursesByOtherId: (idName, dbId) => dispatch(GetCoursesByOtherId(idName, dbId)),
    getCoursesByDepartmentId: departmentId => dispatch(GetCoursesByOtherId('departmentId', departmentId)),
    saveCourseOffline: course => dispatch(SaveCourseOffline(course)),
    setCurrentCourse: course => dispatch(SetCurrentCourse(course))
  };
};

export default com => connect(mapStateToProps, mapDispatchToProps)(com);
