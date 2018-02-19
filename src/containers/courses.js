import { connect } from 'react-redux';
import { GetCourses, GetCoursesByDepartmentId, GetCoursesByOtherId, GetCoursesOffline, SaveCourseOffline, SetCourses, SetCurrentCourse } from 'ducks/courses';

const mapStateToProps = store => {
  return {
    currentCourse: store.courseState.currentCourse,
    courses: store.courseState.courses
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCourses: () => dispatch(GetCourses()),
    getCoursesOffline: () => dispatch(GetCoursesOffline()),
    getCoursesByOtherId: (idName, dbId) => dispatch(GetCoursesByOtherId(idName, dbId)),
    getCoursesByDepartmentId: departmentId => dispatch(GetCoursesByDepartmentId(departmentId)),
    saveCourseOffline: course => dispatch(SaveCourseOffline(course)),
    setCourses: courses => dispatch(SetCourses(courses)),
    setCurrentCourse: course => dispatch(SetCurrentCourse(course))
  };
};

export default com => connect(mapStateToProps, mapDispatchToProps)(com);
