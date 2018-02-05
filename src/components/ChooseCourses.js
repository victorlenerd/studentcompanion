import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  Image,
  FlatList,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux';
import { main, colors } from '../shared/styles';
import { navigator } from '../shared/Navigation';

import { StartRequest, FinishRequest } from '../ducks/Request';
import { GetCoursesByDepartmentId, GetCoursesByOtherId, SetCurrentCourse } from '../ducks/Courses.js';
import { GetNotes } from '../ducks/Notes';
import { GetPapers } from '../ducks/Papers';

var { height, width } = Dimensions.get('window');

import ListView from './ListView';

class ChooseUniversity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
    };
  }

  componentDidMount() {
    this.props
      .getCoursesByDepartmentId(this.props.levelId)
      .then(courses => {
        this.setState({ courses });
      })
      .catch(err => {
        Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
      });
  }

  _openCourse(course) {
    this.props.startRequest();
    this.props.setCurrentCourse(course);

    Promise.all([this.props.getNotes(course.$id), this.props.getPapers(course.$id)])
      .then(() => {
        this.props.finishRequest();
        this.props.navigator.push({
          screen: 'UPQ.Course',
          title: course.name,
          navigatorStyle: {
            navBarButtonColor: colors.white,
            navBarBackgroundColor: colors.primary,
            navBarTextColor: colors.white,
          },
        });
        // navigator.course();
      })
      .catch(err => {
        this.props.finishRequest();
        Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
      });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={'#00384D'} barStyle="light-content" />
        <ListView
          title={'Choose Course'}
          isLoading={this.props.isLoading}
          isConnected={this.props.isConnected}
          data={this.state.courses}
          openItem={this._openCourse.bind(this)}
        />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    startRequest: () => {
      dispatch(StartRequest());
    },
    finishRequest: () => {
      dispatch(FinishRequest());
    },
    setCurrentCourse: course => {
      dispatch(SetCurrentCourse(course));
    },
    getNotes: courseId => {
      return dispatch(GetNotes(courseId));
    },
    getPapers: courseId => {
      return dispatch(GetPapers(courseId));
    },
    getCoursesByDepartmentId: departmentId => {
      return dispatch(GetCoursesByOtherId('levelId', departmentId));
    },
  };
};

const mapStateToProps = store => {
  return {
    isLoading: store.requestState.status,
    isConnected: store.isConnectedState.isConnected,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseUniversity);
