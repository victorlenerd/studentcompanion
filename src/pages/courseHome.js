import React, { Component } from 'react';
import { View, Image, StatusBar, Text, StyleSheet, Alert } from 'react-native';

import capitalize from 'lodash/capitalize';
import filter from 'lodash/filter';

import { main, colors } from 'shared/styles';
import { Button } from 'components/buttons';
import Loader from 'components/loader';

import notes from 'containers/notes';
import users from 'containers/users';
import courses from 'containers/courses';
import questions from 'containers/questions';
import Tracking from 'shared/tracking';
import drawerIcon from 'containers/drawerIcon';

@users
@notes
@courses
@questions
@drawerIcon
class CourseHome extends Component {
  state = {
    notes: [],
    canAddToLibrary: false
  }

  async componentWillMount() {
    const { navigation: { navigate, state: { params: { course, fromPage } } }, setMenu, getNotes } = this.props;
    const { $id } = course;
    const notes = await getNotes($id);

    setMenu(false, fromPage);

    const courseInLibrary = await this.inLibrary($id);

    Tracking.setCurrentScreen('Page_Course_Home');

    if (courseInLibrary) {
      return navigate('Course', { course, fromPage: 'SearchTyped' });
    }

    this.setState({ canAddToLibrary: true, notes });
  }

  saveCourse = async () => {
    const { navigation: { navigate, state: { params: { course } } }, saveCourseOffline, updateLibrary, saveNotesOffline, currentUser: { $id: userId, courses: userCourses } } = this.props;
    const { $id } = course;

    try {
      await updateLibrary(userId, (userCourses) ? userCourses.concat($id) : [$id]);
      await saveCourseOffline(course);
      await saveNotesOffline($id, this.state.notes);
      Alert.alert('Success', `${course.name} Has Been Added To Your Library`, [{ text: 'OK', style: 'cancel' }]);
      return navigate('Course', { course });
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
  }

  inLibrary = async $id => {
    const { getCoursesOffline } = this.props;
    const offlineCourses = await getCoursesOffline();
    const match = filter(offlineCourses, course => {
      if (course.$id === $id) return course;
    });

    return (match.length > 0);
  }

  render() {
    const { navigation: { state: { params: { course: { name } } } } } = this.props;
    return (
      <View style={[main.container, { backgroundColor: colors.brightBlue }]}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <Image resizeMode="contain" source={require('../assets/things.png')} style={{ position: 'absolute', top: 0, left: 0 }} />
        <View style={{ paddingHorizontal: 20, flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
          <Text style={style.label}>{capitalize('Title')}</Text>
          <Text style={style.val}>{name}</Text>
          <Text style={style.label}>Number Of Notes</Text>
          <Text style={style.val}>{this.state.notes.length}</Text>
          {this.state.canAddToLibrary && <Button text="Add To Library" onPress={this.saveCourse} />}
        </View>
        <Loader />
      </View>
    );
  }
}

const style = StyleSheet.create({
  val: {
    fontSize: 32,
    color: colors.white,
    marginBottom: 50
  },
  label: {
    fontSize: 18,
    color: colors.white,
  }
});

export default CourseHome;
