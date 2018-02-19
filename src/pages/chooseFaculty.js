import React, { Component } from 'react';
import { Alert } from 'react-native';

import ListView from 'components/listView';
import faculties from 'containers/faculties';

@faculties
class ChooseFaculty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faculties: [],
    };
  }

  async componentWillMount() {
    const { getFacultiesByUniversityId, navigation: { state: { params: { universityId } } } } = this.props;

    try {
      const faculties = await getFacultiesByUniversityId(universityId);
      this.setState({ faculties });
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
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
