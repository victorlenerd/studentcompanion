import React, { Component } from 'react';
import { View, Text, Alert, FlatList, Image, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';
import { main, colors } from '../shared/styles';
import { navigator } from '../shared/Navigation';

import { StartRequest, FinishRequest } from '../ducks/Request';
import { GetFacultiesByUniversityId } from '../ducks/Faculties.js';

var { height, width } = Dimensions.get('window');

import ListView from './ListView';

class ChooseFaculty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faculties: [],
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.id === 'menu' && !this.state.drawerOpen) {
      this.props.navigator.toggleDrawer({
        side: 'left',
        animated: true,
        to: 'open',
      });
      this.setState({ drawerOpen: true });
    } else {
      this.props.navigator.toggleDrawer({
        side: 'left',
        animated: true,
        to: 'closed',
      });
      this.setState({ drawerOpen: false });
    }
  }

  componentDidMount() {
    this.props.startRequest();

    this.props
      .getFaculties(this.props.universityId)
      .then(faculties => {
        this.setState({
          faculties,
        });
        this.props.finishRequest();
      })
      .catch(err => {
        Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
      });
  }

  _openDepartments({ $id }) {
    let options = {
      userId: this.props.userId,
      universityId: this.props.universityId,
      facultyId: $id,
    };

    if (this.props.settingAcademicInfo) options.settingAcademicInfo = true;
    navigator.chooseDepartment(this.props, options);
  }

  render() {
    return (
      <ListView
        title={'Choose Faculty'}
        isLoading={this.props.isLoading}
        isConnected={this.props.isConnected}
        data={this.state.faculties}
        openItem={this._openDepartments.bind(this)}
      />
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    startRequest: () => {
      dispatch(StartRequest());
    },
    finishRequest: () => {
      dispatch(FinishRequest());
    },
    getFaculties: universityId => {
      return dispatch(GetFacultiesByUniversityId(universityId));
    },
  };
};

const mapStateToProps = store => {
  return {
    isLoading: store.requestState.status,
    isConnected: store.isConnectedState.isConnected,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseFaculty);
