import React, { Component } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';

import { connect } from 'react-redux';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

import { navigator } from '../shared/Navigation';
import { main, colors } from '../shared/styles';
import { Button, BlackButton, ButtonInActive } from './Buttons';

import { Login, UserExist } from '../ducks/User';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      submitted: false,
    };
  }

  _validEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  _signIn() {
    this.setState({ submitted: true });
    this.props.signIn(this.state.email, this.state.password);
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

  render() {
    return (
      <View style={[main.container, { paddingTop: 50 }]}>
        <KeyboardAwareScrollView>
          <View style={[main.content, { flex: 1, flexDirection: 'column' }]}>
            <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
              <View style={main.getStartedLogo}>
                <Image style={main.getStartedLogo} source={require('../assets/logo.png')} />
              </View>
            </View>
            <View style={{ flex: 0.2, paddingTop: 50 }}>
              <Text style={{ fontSize: 20, fontWeight: '300', color: colors.primary, marginBottom: 20 }}>Sign In</Text>

              <TextInput
                placeholder="Email"
                underlineColorAndroid="rgba(0, 0, 0, 0)"
                autoCapitalize="none"
                style={[main.textInput, { backgroundColor: colors.white, paddingLeft: 10 }]}
                onChange={e => this.setState({ email: e.nativeEvent.text })}
              />

              <TextInput
                placeholder="Password"
                underlineColorAndroid="rgba(0, 0, 0, 0)"
                secureTextEntry={true}
                style={[main.textInput, { backgroundColor: colors.white, paddingLeft: 10 }]}
                onChange={e => this.setState({ password: e.nativeEvent.text })}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button onPress={this._signIn.bind(this)} text="Sign In" />
                <TouchableOpacity onPress={() => navigator.forgotPassword(this.props)}>
                  <Text>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <ButtonInActive onPress={() => navigator.signUp()} text="I Am A New User" />
            </View>
          </View>
        </KeyboardAwareScrollView>
        {this.renderIndicator()}
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    signIn: (email, password) => {
      dispatch(Login({ email, password }))
        .then(() => {
          navigator.searchCourses();
        })
        .catch(err => {
          Alert.alert('SignIn Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
        });
    },
  };
};

const mapStateToProps = store => {
  return {
    isLoading: store.requestState.status,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
