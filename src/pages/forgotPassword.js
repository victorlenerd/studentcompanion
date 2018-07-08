import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import auth from 'containers/auth';
import { main, colors } from 'shared/styles';
import { Button } from 'components/buttons';
import Loader from 'components/loader';
import Tracking from 'shared/tracking';

@auth
class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  componentWillMount() {
    Tracking.setCurrentScreen('Page_ForgotPassword');
  }

  send = async () => {
    const { validEmail, sendPasswordReset } = this.props;
    const { email } = this.state;

    if (!validEmail(email)) {
      Alert.alert('Input Error', 'Please enter a valid email address.', [{ text: 'Cancel', style: 'cancel' }]);
    } else {
      try {
        await sendPasswordReset(email);
        Alert.alert('Reset Link Sent', 'The reset password link has been sent to your email', [
          { text: 'Cancel', style: 'cancel' },
        ]);
      } catch (err) {
        Alert.alert('An Error Occured', err.message, [{ text: 'Cancel', style: 'cancel' }]);
      }
    }
  }

  render() {
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
                <Button onPress={this.send} text="Send" />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <Loader />
      </View>
    );
  }
}

export default ForgotPassword;
