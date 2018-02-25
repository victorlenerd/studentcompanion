import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';

import { main, colors } from 'shared/styles';
import Loader from 'components/loader';
import courses from 'containers/courses';
import notes from 'containers/notes';
import papers from 'containers/papers';
import questions from 'containers/questions';

const { width, height } = Dimensions.get('window');

@courses
@notes
@papers
@questions
class SavedCourses extends Component {
  state = { courses: [] }
  async componentWillMount() {
    const { getCoursesOffline } = this.props;

    try {
      const offineCourses = await getCoursesOffline();
      this.setState({ courses: offineCourses });
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
  }

  _openCourse = async course => {
    const { navigation: { navigate }, setCurrentCourse, getNotesOffline, getPapersOffline, getQuestionsOffline } = this.props;
    setCurrentCourse(course);

    try {
      const results = await Promise.all([
        getNotesOffline(course.$id),
        getPapersOffline(course.$id),
        getQuestionsOffline(course.$id),
      ]);

      navigate('Course', results);
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
  }

  _renderSection = () => {
    if (this.state.courses.length) {
      return (
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            {this.state.courses.map(course => {
              return (
                <TouchableOpacity
                  key={course.$id}
                  style={{ padding: 20, marginBottom: 2, backgroundColor: colors.white }}
                  onPress={() => {
                    this._openCourse(course);
                  }}
                >
                  <Text style={{ color: colors.black, fontSize: 18 }}>{course.name}</Text>
                  <Text style={{ color: colors.black, fontSize: 14 }}>{course.code}</Text>
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
