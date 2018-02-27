import React, { Component } from 'react';
import {
  View,
  StatusBar,
  Alert,
  BackHandler
} from 'react-native';

import { colors } from 'shared/styles';
import ListView from 'components/listView';

import users from 'containers/users';
import universities from 'containers/universities';

@users
@universities
class SearchCourses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      universities: []
    };
  }

  async componentWillMount() {
    const { getUniversities } = this.props;

    try {
      const universities = await getUniversities();
      this.setState({ universities });
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
  }

  _openFacuties = ({ $id }) => {
    const { navigation: { navigate } } = this.props;
    navigate('ChooseFaculty', { universityId: $id });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <ListView
          title="Choose School"
          data={this.state.universities}
          openItem={this._openFacuties}
        />
      </View>
    );
  }
}

export default SearchCourses;
