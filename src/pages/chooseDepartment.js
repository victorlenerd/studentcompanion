import React, { Component } from 'react';
import { Alert, BackHandler, Platform } from 'react-native';

import ListView from 'components/listView';
import departments from 'containers/departments';
import drawerIcon from 'containers/drawerIcon';

@departments
@drawerIcon
class ChooseDepartment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
    };
  }

  async componentWillMount() {
    const { setMenu, getDepartmentsByFacultyId, navigation: { state: { params: { facultyId } }, navigate } } = this.props;

    try {
      const facultyDepartments = await getDepartmentsByFacultyId(facultyId);
      this.setState({ departments: facultyDepartments });
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }

    if (Platform.OS === 'ios') {
      setMenu(false, 'ChooseFaculty');
    } else {
      BackHandler.addEventListener('hardwareBackPress', () => {
        navigate('ChooseFaculty');
        return true;
      });
    }
  }

  componentWillUnmount() {
    const { setMenu } = this.props;
    setMenu(true, null);
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
