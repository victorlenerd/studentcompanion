import React, { Component } from 'react';
import { View, Text, Image, NetInfo, StatusBar, Alert, ActivityIndicator } from 'react-native';

import moment from 'moment';

import { connect } from 'react-redux';

import { navigator } from '../shared/Navigation';
import { colors } from '../shared/styles';
import store from '../shared/store';

import { GetCurrentUser, GetCurrentUserOffline, DeleteCurrentUser } from '../ducks/User';
import { StartRequest, FinishRequest } from '../ducks/Request';
import { SetIsConnected } from '../ducks/IsConnected';

import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  // onRegister: function(token) {
  //     console.log( 'TOKEN:', token );
  // },

  // (required) Called when a remote or local notification is opened or received
  // onNotification: function(notification) {
  //     console.log( 'NOTIFICATION:', notification );
  // },

  // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
  // senderID: "YOUR GCM SENDER ID",

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  requestPermissions: true,
});

class Welcome extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const dispatchConnected = isConnected => {
      store.dispatch(SetIsConnected(isConnected));
      this._loadData();
    };

    setTimeout(() => {
      NetInfo.isConnected
        .fetch()
        .then()
        .done(isConnected => {
          store.dispatch(SetIsConnected(isConnected));
          this._loadData();
          NetInfo.isConnected.addEventListener('connectionChange', dispatchConnected);
        });
    }, 0);
  }

  _loadData = () => {
    this.props.startRequest();

    if (this.props.isConnected) {
      this.props
        .getCurrentUser()
        .then(user => {
          let now = moment();
          let paymentDate = moment(user.nextPaymentDate);
          let diffDays = paymentDate.diff(now, 'days');
          this.props.finishRequest();

          console.log('user', user);

          if (user !== null) {
            if (diffDays >= 0) {
              navigator.searchCourses();
            } else {
              navigator.activateAccount();
            }
          } else {
            this.props.deleteCurrentUser().then(() => {
              this.props.finishRequest();
              navigator.intro();
            });
          }
        })
        .catch(err => {
          this.props.finishRequest();
          navigator.intro();
        });
    } else {
      this.props
        .getCurrentUserOffline()
        .then(user => {
          this.props.finishRequest();
          if (user !== null) {
            navigator.searchCourses();
          }
        })
        .catch(err => {
          this.props.finishRequest();
          navigator.intro();
        });
    }
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
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <StatusBar backgroundColor={'#ffffff'} barStyle="light-content" />
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Image resizeMode="contain" source={require('../assets/logo.png')} style={{ height: 150, width: 200 }} />
        </View>
        {this.renderIndicator()}
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
    getCurrentUser: () => {
      return dispatch(GetCurrentUser());
    },
    getCurrentUserOffline: () => {
      return dispatch(GetCurrentUserOffline());
    },
    deleteCurrentUser: () => {
      return dispatch(DeleteCurrentUser());
    },
  };
};

const mapStateToProps = store => {
  return {
    isLoading: store.requestState.status,
    isConnected: store.isConnectedState.isConnected,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
