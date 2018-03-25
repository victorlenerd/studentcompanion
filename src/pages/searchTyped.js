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
import ListView from 'components/listView';

import search from 'containers/search';
import courses from 'containers/courses';
import { main, colors } from 'shared/styles';
import debounce from 'lodash/debounce';

const { width } = Dimensions.get('window');

@search
@courses
class SearchTyped extends Component {
  state = {
    courses: []
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
    });
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
    if (text.length > 3) {
      this.props.search(text);
    }
  }

  _openCourse = course => {
    const { setCurrentCourse, navigation: { navigate } } = this.props;
    const { departmentId, facultyId, universityId, levelId } = course;
    setCurrentCourse(course);
    navigate('CourseHome', { course, departmentId, facultyId, universityId, levelId });
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

export default SearchTyped;
