import React, { Component } from 'react';
import { View, Image, StatusBar, Text, StyleSheet, Alert } from 'react-native';

import capitalize from 'lodash/capitalize';
import filter from 'lodash/filter';

import { main, colors } from 'shared/styles';
import { Button } from 'components/buttons';
import Loader from 'components/loader';

import notes from 'containers/notes';
import papers from 'containers/papers';
import courses from 'containers/courses';

@papers
@notes
@courses
class CourseHome extends Component {
  state = {
    notes: [],
    papers: [],
    photos: [],
    canAddToLibrary: false
  }

  async componentWillMount() {
    const { navigation: { navigate, state: { params: { course } } }, getNotes, getPapers } = this.props;
    const { $id } = course;
    const notes = await getNotes($id);
    const papers = await getPapers($id);

    if (this.inLibrary($id)) {
      return navigate('Course', { course });
    }

    this.setState({ canAddToLibrary: true, notes, papers });
  }

  addCourseToLibrary = async () => {
    const { navigation: { state: { params: { course: { $id } } } } } = this.props;
    this.saveCourse();
  }

  saveCourse = async () => {
    const { navigation: { navigate, state: { params: { course } } }, saveCourseOffline, saveNotesOffline, savePapersOffline, saveQuestionsOffline } = this.props;
    const { $id } = course;

    try {
      await saveCourseOffline(course);
      await saveNotesOffline($id, this.state.notes);
      await savePapersOffline($id, this.state.papers);
      await saveQuestionsOffline($id);
      Alert.alert('Success', `${course.name} Has Been Added To Your Library`, [{ text: 'Cancel', style: 'cancel' }]);
      return navigate('Course', { course });
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
  }

  inLibrary = async $id => {
    const { getCoursesOffline } = this.props;
    const courses = await getCoursesOffline();
    const match = filter(courses, course => {
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
          <Text style={style.label}>Number Of Past Questions</Text>
          <Text style={style.val}>{this.state.papers.length}</Text>
          <Text style={style.label}>Number Of Photos</Text>
          <Text style={style.val}>{this.state.photos.length}</Text>
          {this.state.canAddToLibrary && <Button text="Add To Library" onPress={this.addCourseToLibrary} />}
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
