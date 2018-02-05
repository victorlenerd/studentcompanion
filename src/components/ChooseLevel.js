import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  Image,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux';
import { main, colors } from '../shared/styles';
import { navigator } from '../shared/Navigation';

import { StartRequest, FinishRequest } from '../ducks/Request';
import { GetLevelsByDepartmentId } from '../ducks/Levels.js';

import ListView from './ListView';

var { height, width } = Dimensions.get('window');

class ChooseLevel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      levels: [],
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
      .getLevels(this.props.departmentId)
      .then(levels => {
        this.setState({ levels });
        this.props.finishRequest();
      })
      .catch(err => {
        Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
      });
  }

  _openCourses({ $id }) {
    let options = {
      userId: this.props.userId,
      universityId: this.props.universityId,
      facultyId: this.props.facultyId,
      departmentId: this.props.departmentId,
      levelId: $id,
    };

    if (this.props.settingAcademicInfo) options.settingAcademicInfo = true;

    if (!options.settingAcademicInfo) {
      navigator.chooseCourses(this.props, options);
    } else {
      navigator.savedCourses(options);
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={'#00384D'} barStyle="light-content" />
        <ListView
          title={'Choose Level'}
          isLoading={this.props.isLoading}
          isConnected={this.props.isConnected}
          data={this.state.levels}
          openItem={this._openCourses.bind(this)}
        />
      </View>
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
    getLevels: departmentId => {
      return dispatch(GetLevelsByDepartmentId(departmentId));
    },
  };
};

const mapStateToProps = store => {
  return {
    isLoading: store.requestState.status,
    isConnected: store.isConnectedState.isConnected,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseLevel);
