import React, { Component } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import DeviceInfo from 'react-native-device-info';

import Loader from 'components/loader';
import { main, colors } from 'shared/styles';
import { Button, ButtonInActive } from 'components/buttons';

import auth from 'containers/auth';
import user from 'containers/users';

@user
@auth
class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    const { currentUser, validEmail, navigation: { navigate } } = nextProps;
    if (currentUser.deviceId !== DeviceInfo.getUniqueID()) return navigate('ActivateMuitiDevice');
    if (validEmail(currentUser.email)) return navigate('Home');
  }

  signIn = async () => {
    const { login, validEmail } = this.props;
    const { email, password } = this.state;

    if (validEmail(email) && password !== '') {
      try {
        await login({ email, password });
      } catch (err) {
        Alert.alert('Login Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
      }
    } else {
      Alert.alert('Login Error', 'Email or password is incorrect.', [{ text: 'Cancel', style: 'cancel' }]);
    }
  }

  render() {
    const { navigation: { navigate } } = this.props;

    return (
      <View style={[main.container, { paddingTop: 50 }]}>
        <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />
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
                <Button onPress={this.signIn} text="Sign In" />
                <TouchableOpacity onPress={() => navigate('ForgotPassword')}>
                  <Text>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <ButtonInActive onPress={() => navigate('SignUp')} text="I Am A New User" />
            </View>
          </View>
          <Loader />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default SignIn;
