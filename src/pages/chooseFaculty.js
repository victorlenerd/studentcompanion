import React, { Component } from 'react';
import { Alert, BackHandler, Platform } from 'react-native';

import ListView from 'components/listView';
import faculties from 'containers/faculties';
import drawerIcon from 'containers/drawerIcon';

@faculties
@drawerIcon
class ChooseFaculty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faculties: [],
    };
  }

  async componentWillMount() {
    const { setMenu, getFacultiesByUniversityId, navigation: { state: { params: { universityId } }, navigate } } = this.props;

    try {
      const faculties = await getFacultiesByUniversityId(universityId);
      this.setState({ faculties });
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }

    if (Platform.OS === 'ios') {
      setMenu(false, 'Search');
    } else {
      BackHandler.addEventListener('hardwareBackPress', () => {
        navigate('Search');
        return true;
      });
    }
  }

  componentWillUnmount() {
    const { setMenu } = this.props;
    setMenu(true, null);
  }

  _openDepartments = ({ $id }) => {
    const { navigation: { navigate, state: { params: { universityId } } } } = this.props;
    navigate('ChooseDepartment', { facultyId: $id, universityId });
  }

  render() {
    return (
      <ListView
        title="Choose Faculty"
        data={this.state.faculties}
        openItem={this._openDepartments}
      />
    );
  }
}

export default ChooseFaculty;
