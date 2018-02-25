import React, { Component } from 'react';
import { Alert } from 'react-native';

import ListView from 'components/listView';
import courses from 'containers/courses';

@courses
class ChooseCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
    };
  }

  async componentWillMount() {
    const { getCoursesByOtherId, navigation: { state: { params: { levelId } } } } = this.props;

    try {
      const coursesById = await getCoursesByOtherId('levelId', levelId);
      this.setState({ courses: coursesById });
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
  }

  _openCourse = course => {
    const { setCurrentCourse, navigation: { navigate, state: { params: { facultyId, departmentId, universityId, levelId } } } } = this.props;
    setCurrentCourse(course);
    navigate('CourseHome', { course, departmentId, facultyId, universityId, levelId });
  }

  render() {
    return (
      <ListView
        title="Choose Courses"
        data={this.state.courses}
        openItem={this._openCourse}
      />
    );
  }
}

export default ChooseCourse;
