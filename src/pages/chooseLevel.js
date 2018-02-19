import React, { Component } from 'react';
import { Alert } from 'react-native';

import ListView from 'components/listView';
import levels from 'containers/levels';

@levels
class ChooseLevel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      levels: [],
    };
  }

  async componentWillMount() {
    const { getLevelsByDepartmentId, navigation: { state: { params: { departmentId } } } } = this.props;

    try {
      const levels = await getLevelsByDepartmentId(departmentId);
      this.setState({ levels });
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
  }

  _openCourses = ({ $id }) => {
    const { navigation: { navigate, state: { params: { departmentId, facultyId, universityId } } } } = this.props;
    navigate('ChooseCourse', { levelId: $id, departmentId, facultyId, universityId });
  }

  render() {
    return (
      <ListView
        title="Choose Level"
        data={this.state.levels}
        openItem={this._openCourses}
      />
    );
  }
}

export default ChooseLevel;
