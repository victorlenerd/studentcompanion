import React, { Component } from 'react';
import { Alert } from 'react-native';

import ListView from 'components/listView';
import departments from 'containers/departments';

@departments
class ChooseDepartment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
    };
  }

  async componentWillMount() {
    const { getDepartmentsByFacultyId, navigation: { state: { params: { facultyId } } } } = this.props;

    try {
      const departments = await getDepartmentsByFacultyId(facultyId);
      this.setState({ departments });
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
  }

  _openLevel = ({ $id }) => {
    const { navigation: { navigate, state: { params: { facultyId, universityId } } } } = this.props;
    navigate('ChooseLevel', { departmentId: $id, facultyId, universityId });
  }

  render() {
    return (
      <ListView
        title="Choose Departments"
        data={this.state.departments}
        openItem={this._openLevel}
      />
    );
  }
}

export default ChooseDepartment;
