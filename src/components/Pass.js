import React, { Component } from 'react';
import { View, Image, Text, TextInput, AsyncStorage, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';

import { connect } from 'react-redux';

import { navigator } from '../shared/Navigation';
import { main, pass, colors } from '../shared/styles';

import { UpdateUserDeviceId } from '../ducks/User';
import { StartRequest, FinishRequest } from '../ducks/Request';
import { addKey, clearKeys, deleteKey } from '../ducks/Pass';

import { Button } from './Buttons';

class Pass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
    };
  }

  done = () => {
    this.props.startRequest();

    this.props
      .updateDeviceId(this.state.code)
      .then(() => {
        this.props.finishRequest();
        navigator.searchCourses();
      })
      .catch(err => {
        Alert.alert('An Error Occured', err.message, [{ text: 'Cancel', style: 'cancel' }]);
        this.props.finishRequest();
      });
  };

  renderIndicator() {
    if (this.props.isLoading) {
      return (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator
            color="#fff"
            size="large"
            style={{
              width: 60,
              height: 60,
              backgroundColor: colors.black,
              borderRadius: 6,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </View>
      );
    }
  }

  render() {
    return (
      <View style={main.container}>
        <View style={{ padding: 20 }}>
          <Text style={{ marginVertical: 50, fontSize: 20 }}>Enter Your Code</Text>
          <TextInput
            autoFocus={true}
            onChangeText={code => this.setState({ code })}
            editable={true}
            style={{ height: 50 }}
          />
          <View style={{ marginVertical: 50 }} />
          <Button text="DONE" onPress={this.done} />
        </View>
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
    updateDeviceId: password => {
      return dispatch(UpdateUserDeviceId(password));
    },
    deleteKey: () => {
      dispatch(deleteKey());
    },
    clearKeys: () => {
      dispatch(clearKey());
    },
    addKey: k => {
      dispatch(addKey(k));
    },
  };
};

const mapStateToProps = store => {
  return {
    isLoading: store.requestState.status,
    pass: store.passState.pass,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Pass);
