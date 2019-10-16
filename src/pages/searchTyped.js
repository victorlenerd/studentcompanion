import React, { Component } from 'react';
import {
  Keyboard,
  TextInput,
  View,
  StyleSheet,
  Dimensions,
  BackHandler
} from 'react-native';

import Loader from 'components/loader';
import ListView from 'components/ListView';

import search from 'containers/search';
import courses from 'containers/courses';
import drawerIcon from 'containers/drawerIcon';

import { main, colors } from 'shared/styles';
import Tracking from 'shared/tracking';

import debounce from 'lodash/debounce';
import withBackHandler from '../helpers/withBackHandler';

const { width } = Dimensions.get('window');

@search
@courses
@drawerIcon
class SearchTyped extends Component {
  state = {
    courses: []
  }

  componentWillMount() {
    Tracking.setCurrentScreen('Page_Search_Courses');
    this.props.setMenu(false, 'Home');
  }

  componentDidMount() {
    this.textInput.focus();
  }

  componentWillReceiveProps(nextProps) {
    const { currentSearch } = nextProps;
    this.setState({ courses: currentSearch });
  }

  componentWillUnmount() {
    Keyboard.dismiss();
    BackHandler.removeEventListener('hardwareBackPress');
  }

  setSearch = text => {
    if (text.length > 0) {
      this.props.search(text);
    }
  }

  _openCourse = course => {
    const { setCurrentCourse, navigation: { replace } } = this.props;
    const { departmentId, facultyId, universityId, levelId } = course;
    setCurrentCourse(course);
    replace('CourseHome', { course, departmentId, facultyId, universityId, levelId });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={style.header}>
          <TextInput ref={e => this.textInput = e} placeholder="Search" style={[main.textInput, style.headerText]} autoFocus={true} onChangeText={debounce(this.setSearch, 500)} />
        </View>
        {this.state.courses.length > 0 && <ListView title="Courses" openItem={this._openCourse} data={this.state.courses} hideHeader={true} hideEmptyState={true} hideLoader={true} />}
        <Loader />
      </View>
    );
  }
}

const style = StyleSheet.create({
  header: {
    width,
    alignItems: 'center',
    padding: 20,
    height: 80,
    backgroundColor: colors.accent,
  },
  headerText: {
    width: width - 40,
    height: 50,
    fontSize: 22,
    color: colors.white,
    alignItems: 'center'
  }
});

export default withBackHandler(SearchTyped, 'Home');
