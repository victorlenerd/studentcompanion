import React, { Component } from 'react';
import { Alert, BackHandler, Platform } from 'react-native';

import ListView from 'components/listView';
import levels from 'containers/levels';
import drawerIcon from 'containers/drawerIcon';
import Tracking from 'shared/tracking';

@levels
@drawerIcon
class ChooseLevel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      levels: [],
    };
  }

  async componentWillMount() {
    const { setMenu, getLevelsByDepartmentId, navigation: { state: { params: { departmentId } }, navigate } } = this.props;

    Tracking.setCurrentScreen('Page_Choose_Level');

    try {
      const levels = await getLevelsByDepartmentId(departmentId);
      this.setState({ levels });
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }

    if (Platform.OS === 'ios') {
      setMenu(false, 'ChooseDepartment');
    } else {
      BackHandler.addEventListener('hardwareBackPress', () => {
        navigate('ChooseDepartment');
        return true;
      });
    }
  }

  componentWillUnmount() {
    const { setMenu } = this.props;
    setMenu(true, null);
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
