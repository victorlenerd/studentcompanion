import React, { PureComponent } from 'react';
import { View, Text, StatusBar, ScrollView, Alert } from 'react-native';

import users from 'containers/users';
import Loader from 'components/loader';

import { main, colors } from 'shared/styles';
import { Button, ButtonInActive } from 'components/buttons';

@users
class ActivateEmail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      codeSent: false,
    };
  }

  signout = async () => {
    const { signOut, navigation: { navigate } } = this.props;
    try {
      await signOut();
      navigate('Intro');
    } catch (err) {
      Alert.alert('An Error Occured', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
  }

  sendActivationCode = async () => {
    const { sendEmailVerificationCode, currentUser: { email, $id } } = this.props;
    try {
      await sendEmailVerificationCode(email, $id);
      this.setState({ codeSent: true });
    } catch (err) {
      Alert.alert('An Error Occured', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
  }


  _renderSection() {
    const { navigation: { navigate } } = this.props;

    if (this.state.codeSent) {
      return (
        <View style={{ marginTop: 100, marginBottom: 100 }}>
          <Text style={{ color: colors.white, fontSize: 32, textAlign: 'center', fontWeight: '200' }}>
            Email Verification.
          </Text>
          <Text style={{ color: colors.white, fontSize: 18, textAlign: 'center', marginBottom: 25, marginTop: 25 }}>
            A code has been sent to your email to verify your email address.
          </Text>
          <Button
            onPress={() => navigate('Pass')}
            text="Ok, Got It!"
          />
          <ButtonInActive onPress={this.sendActivationCode} text="Resend Code Now." />
        </View>
      );
    }

    return (
      <View style={{ marginTop: 100, marginBottom: 100 }}>
        <Text style={{ color: colors.white, fontSize: 32, textAlign: 'center', fontWeight: '200' }}>
          Verify Your Email Address.
        </Text>
        <Text style={{ color: colors.white, fontSize: 18, textAlign: 'center', marginBottom: 25, marginTop: 25 }}>
          Please verify your email address to continue using this service. A verification code will be sent to your email address.
        </Text>
        <Button onPress={this.sendActivationCode} text="Verify Email" />
        <ButtonInActive onPress={this.signout} text="No Not Now." />
      </View>
    );
  }

  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.black }}>
        <View style={[main.container, { backgroundColor: colors.black }]}>
          <View>
            <StatusBar backgroundColor={colors.black} barStyle="light-content" />
            <View
              style={[
                main.content,
                { flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column' },
              ]}
            >
              {this._renderSection()}
            </View>
          </View>
        </View>
        <Loader />
      </ScrollView>
    );
  }
}

export default ActivateEmail;
