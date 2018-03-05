import React, { Component } from 'react';

import { BackHandler } from 'react-native';
import { TabNavigator } from 'react-navigation';

import ChooseNotesScreen from 'pages/chooseNotes';
import ChoosePapersScreen from 'pages/choosePapers';

const CourseNavigator = TabNavigator({
  ChooseNotes: {
    screen: ChooseNotesScreen,
    navigationOptions: {
      tabBarLabel: 'NOTES'
    }
  },
  ChoosePapers: {
    screen: ChoosePapersScreen,
    navigationOptions: {
      tabBarLabel: 'PAST QUESTIONS'
    }
  }
}, {
  tabBarOptions: {
    tabStyle: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    labelStyle: {
      fontSize: 15,
    }
  }
});

class Course extends Component {
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
  }

  render() {
    return (<CourseNavigator />);
  }
}

export default Course;
