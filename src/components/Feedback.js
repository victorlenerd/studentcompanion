import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  NetInfo,
  StatusBar,
  Dimensions,
} from 'react-native';

import { connect } from 'react-redux';
import { main, colors } from '../shared/styles';

import { StartRequest, FinishRequest } from '../ducks/Request';
import { GetCurrentUser } from '../ducks/User';
import { SendFeedback } from '../ducks/Feedback';

import { Button } from './Buttons';

var { height, width } = Dimensions.get('window');

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedback: '',
      drawerOpen: false,
      submitted: false,
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.id === 'sideMenu') {
      //Do nothing
    } else if (event.id === 'menu' && !this.state.drawerOpen) {
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

  _submit() {
    this.setState({ submitted: true });

    if (this.state.feedback.length > 1) {
      this.props.startRequest();
      this.props
        .getCurrentUser()
        .then(user => {
          this.props
            .sendFeedback(user.$id, this.state.feedback)
            .then(() => {
              Alert.alert('Sent', 'Thanks for the feedback.', [{ text: 'Ok', style: 'cancel' }]);
              this.setState({ submitted: false });
              this.props.finishRequest();
            })
            .catch(err => {
              Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
              this.setState({ submitted: false });
              this.props.finishRequest();
            });
        })
        .catch(err => {
          Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
        });
    }
  }

  _renderIndicator() {
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

  renderOfflineBanner() {
    if (!this.props.isConnected) {
      return (
        <View style={{ width, height: 80, paddingLeft: 20, justifyContent: 'center', backgroundColor: colors.red }}>
          <Text style={{ color: colors.white, fontSize: 22, fontWeight: '300' }}>You are offline!</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <View
        style={{
          width,
          height,
          flexDirection: 'column',
          backgroundColor: colors.lightBlue,
          borderTopColor: colors.accent,
          borderTopWidth: 2,
        }}
      >
        <StatusBar backgroundColor={'#00384D'} barStyle="light-content" />
        {this.renderOfflineBanner()}
        <View style={{ height: 300, padding: 20 }}>
          <TextInput
            autoCapitalize="none"
            placeholder="Type your feedback here"
            multiline={true}
            textAlignVertical="top"
            underlineColorAndroid="rgba(0, 0, 0, 0)"
            blurOnSubmit={false}
            editable={true}
            onChange={e => this.setState({ feedback: e.nativeEvent.text })}
            style={[
              main.textInput,
              {
                height: 300,
                backgroundColor: this.state.submitted && this.state.feedback.length < 1 ? colors.red : colors.lightBlue,
                fontSize: 18,
              },
            ]}
          />
        </View>
        <View style={{ padding: 20, marginBottom: 50 }}>
          <Button text="Submit" onPress={() => this._submit()} />
        </View>
        {this._renderIndicator()}
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
    sendFeedback: (userId, feedback) => {
      return dispatch(SendFeedback(userId, feedback));
    },
    getCurrentUser: () => {
      return dispatch(GetCurrentUser());
    },
  };
};

const mapStateToProps = store => {
  return {
    isLoading: store.requestState.status,
    isConnected: store.isConnectedState.isConnected,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
