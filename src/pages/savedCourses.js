import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  Image,
  Alert
} from 'react-native';

import { main, colors } from 'shared/styles';
import Loader from 'components/loader';

import courses from 'containers/courses';
import notes from 'containers/notes';
import connection from 'containers/connection';
import drawerIcon from 'containers/drawerIcon';
import user from 'containers/users';
import Tracking from 'shared/tracking';

const { width, height } = Dimensions.get('window');

@user
@courses
@notes
@connection
@drawerIcon
class SavedCourses extends Component {
  state = { courses: [] }
  async componentWillMount() {
    const { setMenu, getCoursesOffline, saveCourseOffline, saveNotesOffline, currentUser, updateLibrary, getCourse, getNotes } = this.props;

    Tracking.setCurrentScreen('Page_Library');
    setMenu(false, 'Home');

    let remoteCourses;
    const { $id } = currentUser;


    if (!currentUser.courses) {
      remoteCourses = [];
    } else {
      remoteCourses = currentUser.courses;
    }

    // await saveCourseOffline(course);
    // await saveNotesOffline($id, this.state.notes);

    try {
      const offineCourses = await getCoursesOffline();
      const offlineCoursesId = offineCourses.map(({ id }) => id);
      const notSavedOffline = remoteCourses.filter(({ id }) => offlineCoursesId.indexOf(id) === -1);
      const notSavedOnline = offlineCoursesId.filter(({ id }) => remoteCourses.indexOf(id) === -1);

      if (notSavedOffline.length !== notSavedOnline.length) {
        await updateLibrary($id, notSavedOffline.concat(notSavedOnline));
        if (notSavedOffline.length >= 1) {
          const getAllCourses = notSavedOffline.map(cid => getCourse(cid));
          const getAllNotes = notSavedOffline.map(cid => getNotes(cid));
          const allCourses = await Promise.all(getAllCourses);
          const allNotes = await Promise.all(getAllNotes);

          allCourses.forEach((course, i) => {
            course.id = notSavedOffline[i];
            this.setState({
              courses: this.state.courses.concat(course)
            }, () => {
              const courseNotes = [].concat.apply([], ...allNotes).filter(n => n.courseId === course.id);
              saveNotesOffline(course.id, courseNotes);
              saveCourseOffline(course);
            });
          });
        }
      } else {
        this.setState({ courses: offineCourses });
      }
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
  }

  _openCourse = async course => {
    const { navigation: { navigate }, setCurrentCourse, getNotes, getNotesOffline, isConnected } = this.props;
    setCurrentCourse(course);

    try {
      let results;

      if (isConnected) {
        results = await getNotes(course.id);
      } else {
        results = getNotesOffline(course.id);
      }

      navigate('Course', { ...results, fromPage: 'SavedCourses' });
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
  }

  _deleteCourse = ({ name, id }) => {
    const { removeNoteOffline, removeCourseOffline } = this.props;

    Alert.alert('Delete Course', `Are you sure you want to remove ${name} from you library`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes',
          onPress: async () => {
            await removeNoteOffline(id);
            await removeCourseOffline(id);
            this.setState({
              courses: this.state.courses.filter(c => c.id !== id)
            });
          } }
      ]);
  }

  _renderSection = () => {
    if (this.state.courses.length) {
      return (
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            {this.state.courses.map(course => {
              return (
                <TouchableOpacity
                  key={course.id}
                  style={{ padding: 20, marginBottom: 2, backgroundColor: colors.white, flexDirection: 'row', justifyContent: 'space-between' }}
                  onPress={() => {
                    this._openCourse(course);
                  }}
                >
                  <Text style={{ color: colors.black, fontSize: 18, flex: 0.9 }}>{course.name}</Text>

                  <TouchableOpacity onPress={() => this._deleteCourse(course)}>
                    <Image source={require('../assets/bin.png')} style={{ width: 20, height: 20 }} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <View style={[main.emptyState, { margin: 20 }]}>
            <Text style={main.emptyStateText}>You do not have any course saved.</Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View
        style={{
          width,
          height,
          flexDirection: 'row',
          backgroundColor: colors.lightBlue,
          borderTopColor: colors.accent,
          borderTopWidth: 2
        }}
      >
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <View style={[main.content, { flex: 1, padding: 0 }]}>{this._renderSection()}</View>
        <Loader />
      </View>
    );
  }
}

export default SavedCourses;
