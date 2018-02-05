import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import { connect } from 'react-redux';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

import { navigator } from '../shared/Navigation';
import { main, colors } from '../shared/styles';
import store from '../shared/store';
import { Button, BlackButton, ButtonInActive } from './Buttons';

import { SendResetPasswordEmail } from '../ducks/User';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      submitted: false,
    };
  }

  _validEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

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

  _send() {
    this.setState({ submitted: true });

    if (!this._validEmail(this.state.email)) {
      Alert.alert('Input Error', 'Please enter a valid email address.', [{ text: 'Cancel', style: 'cancel' }]);
    } else {
      store
        .dispatch(SendResetPasswordEmail(this.state.email))
        .then(() => {
          Alert.alert('Reset Link Sent', 'The reset password link has been sent to your email', [
            { text: 'Cancel', style: 'cancel' },
          ]);
        })
        .catch(err => {
          Alert.alert('An Error Occured', err.message, [{ text: 'Cancel', style: 'cancel' }]);
        });
    }
  }

  render() {
    return (
      <View style={[main.container, { paddingTop: 50 }]}>
        <StatusBar backgroundColor={'#00384D'} barStyle="light-content" />
        <KeyboardAwareScrollView>
          <View style={[main.content, { flex: 1, flexDirection: 'column' }]}>
            <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
              <View style={main.getStartedLogo}>
                <Image style={main.getStartedLogo} source={require('../assets/logo.png')} />
              </View>
            </View>
            <View style={{ flex: 0.2, paddingTop: 50 }}>
              <Text style={{ fontSize: 20, fontWeight: '300', color: colors.primary, marginBottom: 20 }}>
                Forgot Password
              </Text>
              <TextInput
                placeholder="Email"
                underlineColorAndroid="rgba(0, 0, 0, 0)"
                style={[main.textInput, { backgroundColor: colors.white, paddingLeft: 10 }]}
                onChange={e => this.setState({ email: e.nativeEvent.text })}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button onPress={this._send.bind(this)} text="Send" />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        {this.renderIndicator()}
      </View>
    );
  }
}

const mapStateToProps = store => {
  return {
    isLoading: store.requestState.status,
  };
};

export default connect(mapStateToProps)(ForgotPassword);
