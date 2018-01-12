import React, { Component } from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Image,
    NetInfo,
    Alert
} from 'react-native';

import { connect } from "react-redux";

import {IndicatorViewPager, PagerTitleIndicator} from 'rn-viewpager';

import CourseNotes from './CourseNotes';
import CoursePapers from './CoursePapers';

import { main, colors } from '../shared/styles';
import { navigator } from '../shared/Navigation';

import { StartRequest, FinishRequest } from '../ducks/Request';
import { SaveCourseOffline, GetCoursesOffline } from '../ducks/Courses';
import { SaveQuestionsOffline  } from '../ducks/Questions';
import { SavePapersOffline } from '../ducks/Papers';
import { SaveNotesOffline } from '../ducks/Notes';
var PushNotification = require('react-native-push-notification');

var { width } = Dimensions.get('window');

class Course extends Component {
    constructor(props){
        super(props);
        this.state = {
            isConnected: false,
        }

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.id === 'sideMenu') {
            //Do nothing
        } else if (event.id === "menu" && !this.state.drawerOpen) {
            this.props.navigator.toggleDrawer({
                side: 'left',
                animated: true,
                to: 'open'
            });
            this.setState({drawerOpen: true});
        } else {
            this.props.navigator.toggleDrawer({
                side: 'left',
                animated: true,
                to: 'closed'
            });
            this.setState({drawerOpen: false});
        }
    }

    componentDidMount() {
        const dispatchConnected =( isConnected )=> {
            this.setState({isConnected});
        };

        NetInfo.isConnected.fetch().then().done((isConnected)=> {
            this.setState({isConnected});
            NetInfo.isConnected.addEventListener('connectionChange', dispatchConnected);
        });

        this.props.getCoursesOffline()
        .then((courses)=> {
            let match = courses.filter((course)=> {
                if (course.$id == this.props.currentCourse.$id) return course;
            });
            
            if  (match.length > 0) {
                this._saveCourse(true);
            } else {
                Alert.alert("Save Course", "Do you want to save this course?",[
                    {text: 'Cancel'},
                    {text: 'Ok', onPress:()=> { this._saveCourse()}}
                ]);
            }
        })
        .catch((err)=> {
            Alert.alert("Error", err.message,[
                {text: 'Cancel', style: 'cancel'},
            ]);
        });
    }

     _renderTitleIndicator() {
        return <PagerTitleIndicator titles={['Notes', 'Past Questions']} />;
    }
    
    _saveCourse() {
        this.props.startRequest();

        this.props.saveCourseOffline(this.props.currentCourse)
        .then(()=> {
            Promise.all([
                this.props.saveNotesOffline(this.props.currentCourse.$id, this.props.notes),
                this.props.savePapersOffline(this.props.currentCourse.$id, this.props.papers),
                this.props.saveQuestionsOffline(this.props.currentCourse.$id)
            ])
            .then(()=> {
                this.props.finishRequest();
            })
            .catch((err)=> {
                this.props.finishRequest();
                Alert.alert("Error", err.message,[
                    {text: 'Cancel', style: 'cancel'},
                ]);
            });
        })
        .catch((err)=> {
            this.props.finishRequest();
            Alert.alert("Error", err.message,[
                {text: 'Cancel', style: 'cancel'},
            ]);
        });
    }

    render () {
        return (
            <View style={{flex: 1, borderTopColor: colors.accent, borderTopWidth: 2}}>
                <IndicatorViewPager style={{flex: 1}} indicator={this._renderTitleIndicator()}>
                    <View style={{flex: 1}}>
                        <CourseNotes navigator={this.props.navigator} notes={this.props.notes}></CourseNotes>
                    </View>
                    <View style={{flex: 1}}>
                        <CoursePapers navigator={this.props.navigator} papers={this.props.papers} currentPaper={this.props.currentPaper}></CoursePapers>
                    </View>
                </IndicatorViewPager>
            </View>
        );
    }
}

const mapDispatchToProps = (dispatch)=> {
    return {
        startRequest:()=> {
            dispatch(StartRequest());
        },
        finishRequest:()=> {
            dispatch(FinishRequest());
        },
        saveCourseOffline:(course)=> {
            return dispatch(SaveCourseOffline(course));
        },
        saveNotesOffline:(courserId, notes)=> {
            return dispatch(SaveNotesOffline(courserId, notes));
        },
        savePapersOffline:(courserId, papers)=> {
            return dispatch(SavePapersOffline(courserId, papers));
        },
        saveQuestionsOffline:(courseId)=> {
            return dispatch(SaveQuestionsOffline(courseId));
        },
        getCoursesOffline:()=> {
            return dispatch(GetCoursesOffline());
        }
    }
};

const mapStateToProps = (store)=> {
    return {
        notes: store.notesState.notes,
        currentCourse: store.courseState.currentCourse,
        papers: store.paperState.papers,
        currentPaper: store.paperState.currentPaper
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Course);
