import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  Alert,
} from 'react-native';

import { main, colors } from 'shared/styles';
import Loader from 'components/loader';
import courses from 'containers/courses';
import notes from 'containers/notes';
import connection from 'containers/connection';
import Tracking from 'shared/tracking';

const { width, height } = Dimensions.get('window');

@courses
@notes
@connection
class SavedCourses extends Component {
  state = { courses: [] }
  async componentWillMount() {
    const { getCoursesOffline } = this.props;

    Tracking.setCurrentScreen('Page_Library');

    try {
      const offineCourses = await getCoursesOffline();
      this.setState({ courses: offineCourses });
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
        results = await getNotes(course.$id);
      } else {
        results = getNotesOffline(course.$id);
      }

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
