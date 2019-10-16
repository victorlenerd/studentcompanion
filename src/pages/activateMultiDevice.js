import React, { PureComponent } from 'react';
import { View, Text, StatusBar, ScrollView, Alert } from 'react-native';

import users from 'containers/users';
import Loader from 'components/loader';

import { main, colors } from 'shared/styles';
import { Button, ButtonInActive } from 'components/Buttons';
import Tracking from 'shared/tracking';

@users
class ActivateMultipleDevice extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      codeSent: false,
    };
  }

  componentWillMount() {
    Tracking.setCurrentScreen('Page_Activate_Device');
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
    const { sendDeviceActivationCode, currentUser: { email, $id, name } } = this.props;
    try {
      await sendDeviceActivationCode(email, $id, name);
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
            Device Acivation Code.
          </Text>
          <Text style={{ color: colors.white, fontSize: 18, textAlign: 'center', marginBottom: 25, marginTop: 25 }}>
            A six digit code has been sent to your email to activate this device.
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
          Activate This Device.
        </Text>
        <Text style={{ color: colors.white, fontSize: 18, textAlign: 'center', marginBottom: 25, marginTop: 25 }}>
          You cannot use your account on more than one device. You can deactivate the original device and activate this new device.
        </Text>
        <Button onPress={this.sendActivationCode} text="Activate New Device" />
        <ButtonInActive onPress={this.signout} text="Go Back" />
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

export default ActivateMultipleDevice;
