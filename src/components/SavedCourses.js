import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';

import { connect } from 'react-redux';

import { navigator } from '../shared/Navigation';
import { main, colors } from '../shared/styles';

import { GetCurrentUser, SetAcademicInfo } from '../ducks/User';
import {
  GetCoursesOffline,
  GetCourses,
  SetCourses,
  SetCurrentCourse,
  GetCoursesByOtherId,
  SaveCourseOffline,
} from '../ducks/Courses';
import { GetPapersOffline, GetPapers, SavePapersOffline } from '../ducks/Papers';
import { GetNotesOffline, GetNotes, SaveNotesOffline } from '../ducks/Notes';
import { GetQuestionsOffline, GetQuestions, SaveQuestionsOffline } from '../ducks/Questions';
import { StartRequest, FinishRequest } from '../ducks/Request';

var { width, height } = Dimensions.get('window');

import ListView from './ListView';

class SavedCourses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.id === 'sideMenu') {
      //Do nothing
    } else if (event.id === 'menu' && !this.state.drawerOpen) {
      this.props.navigator.toggleDrawer({
        side: 'left',
        animated: true,
        to: 'open',
      });
      this.setState({ drawerOpen: true });
    } else {
      this.props.navigator.toggleDrawer({
        side: 'left',
        animated: true,
        to: 'closed',
      });
      this.setState({ drawerOpen: false });
    }
  }

  componentDidMount() {
    this.props.startRequest();

    this.props
      .getCoursesOffline()
      .then(courses => {
        this.props.setCourses(courses);
        this.props.finishRequest();
      })
      .catch(err => {
        this.props.finishRequest();
        Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
      });

    if (this.props.settingAcademicInfo) {
      let { universityId, facultyId, departmentId, levelId, userId } = this.props;
      this._setAcademicInfo(universityId, facultyId, departmentId, levelId, userId);
    }
  }

  _setAcademicInfo(universityId, facultyId, departmentId, levelId, userId) {
    this.props.startRequest();

    this.props
      .setAcademicInfo(userId, {
        universityId,
        facultyId,
        departmentId,
        levelId,
      })
      .then(() => {
        this.props
          .getCourses(levelId)
          .then(courses => {
            let saveCoursesOffline = courses.map((course, index) => {
              return new Promise((resolve, reject) => {
                Promise.all([this.props.getNotes(course.$id), this.props.getPapers(course.$id)])
                  .then(results => {
                    let notes = results[0];
                    let papers = results[1];

                    this.props
                      .saveCourseOffline(course)
                      .then(() => {
                        Promise.all([
                          this.props.saveNotesOffline(course.$id, notes),
                          this.props.savePapersOffline(course.$id, papers),
                          this.props.saveQuestionsOffline(course.$id),
                        ])
                          .then(() => {
                            resolve();
                          })
                          .catch(err => {
                            reject();
                            Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
                          });
                      })
                      .catch(err => {
                        reject();
                        Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
                      });
                  })
                  .catch(err => {
                    Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
                  });
              });
            });

            Promise.all(saveCoursesOffline)
              .then(() => {
                navigator.savedCourses();
              })
              .catch(err => {
                Alert.alert('An Error Occured', err.message, [{ text: 'Cancel', style: 'cancel' }]);
              });
          })
          .catch(err => {
            this.props.finishRequest();
            Alert.alert('An Error Occured', err.message, [{ text: 'Cancel', style: 'cancel' }]);
          });
      })
      .catch(err => {
        this.props.finishRequest();
        Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
      });
  }

  _openCourse(course) {
    this.props.startRequest();
    this.props.setCurrentCourse(course);

    Promise.all([
      this.props.getNotesOffline(course.$id),
      this.props.getPapersOffline(course.$id),
      this.props.getQuestionsOffline(course.$id),
    ])
      .then(results => {
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
        // navigator.course(course.name);
      })
      .catch(err => {
        this.props.finishRequest();
        Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
      });
  }

  renderIndicator() {
    if (this.props.isLoading) {
      return (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator
            color="#fff"
            size="large"
            style={{
              width: 60,
              height: 60,
              backgroundColor: colors.black,
              borderRadius: 6,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </View>
      );
    }
  }

  _renderSection() {
    if (this.props.courses.length) {
      return (
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            {this.props.courses.map((course, index) => {
              if (course) {
                return (
                  <TouchableOpacity
                    key={index}
                    style={{ padding: 20, marginBottom: 2, backgroundColor: colors.white }}
                    onPress={() => {
                      this._openCourse(course);
                    }}
                  >
                    <Text style={{ color: colors.black, fontSize: 18 }}>{course.name}</Text>
                    <Text style={{ color: colors.black, fontSize: 14 }}>{course.code}</Text>
                    <Text style={{ color: colors.black, fontSize: 12, marginTop: 10 }}>{course.departmentName}</Text>
                  </TouchableOpacity>
                );
              }
            })}
          </ScrollView>
        </View>
      );
    } else {
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
          borderTopWidth: 2,
        }}
      >
        <StatusBar backgroundColor={'#00384D'} barStyle="light-content" />
        <View style={[main.content, { flex: 1, padding: 0 }]}>{this._renderSection()}</View>
        {this.renderIndicator()}
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
    setAcademicInfo: (userId, academicInfo) => {
      return dispatch(SetAcademicInfo(userId, academicInfo));
    },
    setCourses: courses => {
      dispatch(SetCourses(courses));
    },
    setCurrentCourse: course => {
      dispatch(SetCurrentCourse(course));
    },
    saveCourseOffline: course => {
      return dispatch(SaveCourseOffline(course));
    },
    saveNotesOffline: (courseId, notes) => {
      return dispatch(SaveNotesOffline(courseId, notes));
    },
    savePapersOffline: (courseId, papers) => {
      return dispatch(SavePapersOffline(courseId, papers));
    },
    saveQuestionsOffline: courseId => {
      return dispatch(SaveQuestionsOffline(courseId));
    },
    getCourses: levelId => {
      return dispatch(GetCoursesByOtherId('levelId', levelId));
    },
    getCoursesOffline: () => {
      return dispatch(GetCoursesOffline());
    },
    getNotesOffline: courseId => {
      return dispatch(GetNotesOffline(courseId));
    },
    getPapersOffline: courseId => {
      return dispatch(GetPapersOffline(courseId));
    },
    getQuestionsOffline: courseId => {
      return dispatch(GetQuestionsOffline(courseId));
    },
    getNotes: courseId => {
      return dispatch(GetNotes(courseId));
    },
    getPapers: courseId => {
      return dispatch(GetPapers(courseId));
    },
  };
};

const mapStateToProps = store => {
  return {
    courses: store.courseState.courses,
    isLoading: store.requestState.status,
    currentCourse: store.courseState.currentCourse,
    isConnected: store.isConnectedState.isConnected,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedCourses);
