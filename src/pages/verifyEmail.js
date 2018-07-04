import React, { PureComponent } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StatusBar,
  Keyboard
} from 'react-native';

import { main, colors } from 'shared/styles';

import Loader from 'components/loader';
import { Button } from 'components/buttons';
import auth from 'containers/auth';

@auth
class VerifyEmail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { code: '' };
  }

  componentWillUnmount() {
    Keyboard.dismiss();
  }

  done = async () => {
    const { updateEmailVerification, navigation: { navigate } } = this.props;

    if (this.state.code.length < 1) {
      Alert.alert('Err! Invalid Code', 'You cannote submit an empty text', [{ text: 'Cancel', style: 'cancel' }]);
    }

    try {
      const done = await updateEmailVerification(this.state.code);
      if (done) {
        return navigate('Welcome');
      }

      Alert.alert('An Error Occured', 'The code you used is not valid.', [{ text: 'Cancel', style: 'cancel' }]);
    } catch (err) {
      Alert.alert('An Error Occured', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
  };

  render() {
    return (
      <View style={main.container}>
        <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />
        <View style={{ padding: 20 }}>
          <Text style={{ marginVertical: 50, fontSize: 20 }}>Enter Email Verification Your Code</Text>
          <TextInput
            autoFocus={true}
            onChangeText={code => this.setState({ code })}
            editable={true}
            keyboardType="phone-pad"
            style={{ height: 50, textAlign: 'center' }}
          />
          <View style={{ marginVertical: 50 }} />
          <Button text="DONE" onPress={this.done} />
        </View>
        <Loader />
      </View>
    );
  }
}

export default VerifyEmail;