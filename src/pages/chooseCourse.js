import React, { Component } from 'react';
import { Alert, BackHandler, Platform } from 'react-native';

import ListView from 'components/ListView';
import courses from 'containers/courses';
import drawerIcon from 'containers/drawerIcon';
import Tracking from 'shared/tracking';

@courses
@drawerIcon
class ChooseCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
    };
  }

  async componentWillMount() {
    const { setMenu, getCoursesByOtherId, navigation: { state: { params: { levelId } }, navigate } } = this.props;

    Tracking.setCurrentScreen('Page_Choose_Course');

    try {
      const coursesById = await getCoursesByOtherId('levelId', levelId);
      this.setState({ courses: coursesById });
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }

    if (Platform.OS === 'ios') {
      setMenu(false, 'ChooseLevel');
    } else {
      BackHandler.addEventListener('hardwareBackPress', () => {
        navigate('ChooseLevel');
        return true;
      });
    }
  }

  _openCourse = course => {
    const { setMenu, setCurrentCourse, navigation: { navigate, state: { params: { facultyId, departmentId, universityId, levelId } } } } = this.props;
    setCurrentCourse(course);
    setMenu(false, 'ChooseCourse');
    navigate('CourseHome', { fromPage: 'ChooseCourse', course, departmentId, facultyId, universityId, levelId });
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
