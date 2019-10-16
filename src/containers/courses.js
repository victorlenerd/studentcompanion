import { connect } from 'react-redux';
import { GetCoursesByOtherId, GetCourse, GetCoursesOffline, SaveCourseOffline, SetCurrentCourse, RemoveCourseOffline } from 'ducks/Courses';

const mapStateToProps = store => {
  return {
    currentCourse: store.courseState.currentCourse,
    courses: store.courseState.courses
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCourse: id => dispatch(GetCourse(id)),
    getCoursesOffline: () => dispatch(GetCoursesOffline()),
    getCoursesByOtherId: (idName, dbId) => dispatch(GetCoursesByOtherId(idName, dbId)),
    getCoursesByDepartmentId: departmentId => dispatch(GetCoursesByOtherId('departmentId', departmentId)),
    saveCourseOffline: course => dispatch(SaveCourseOffline(course)),
    removeCourseOffline: courseId => dispatch(RemoveCourseOffline(courseId)),
    setCurrentCourse: course => dispatch(SetCurrentCourse(course))
  };
};

export default com => connect(mapStateToProps, mapDispatchToProps)(com);
