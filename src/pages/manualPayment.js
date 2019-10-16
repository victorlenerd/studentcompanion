import React, { Component } from 'react';
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
import { Button } from 'components/Buttons';
import auth from 'containers/auth';
import Tracking from 'shared/tracking';
import app, { toArray } from 'shared/Firebase';
import users from 'containers/users';
import connection from 'containers/connection';
import resetToWelcome from '../helpers/redirect';

@auth
@users
@connection
class CompleteManualPayment extends Component {
  constructor(props) {
    super(props);
    this.state = { code: '' };
  }

  componentDidMount() {
    Tracking.setCurrentScreen('Page_Device_Activation_Code');
    this.props
      .getCurrentUser()
      .then(user => {
        this.setState({
          email: user.email,
        });
      })
      .catch(err => {
        Alert.alert('System error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
      });
  }

  done = async () => {
    const { navigation, startRequest, finishRequest } = this.props;
    startRequest();
    const { code } = this.state;
    if (code.length < 1) {
      Alert.alert('Err! Invalid Code', 'You cannote submit an empty text', [{ text: 'Cancel', style: 'cancel' }]);
    }
    try {
      const usersRefs = app.database().ref('/users');
      usersRefs
        .orderByChild('email')
        .equalTo(this.state.email)
        .once('value', async snapshot => {
          const user = toArray(snapshot.val());
          if (user !== null) {
            if (user[user.length - 1].paymentVerificationCode === code) {
              Keyboard.dismiss();
              return resetToWelcome(navigation);
            }
            Alert.alert('An Error Occured', 'The code you used is not valid.', [{ text: 'Cancel', style: 'cancel' }]);
          }
          finishRequest();
        });
    } catch (err) {
      finishRequest();
      Alert.alert('An Error Occured', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
  };

  render() {
    return (
      <View style={main.container}>
        <StatusBar backgroundColor={colors.lightBlue} barStyle="light-content" />
        <View style={{ padding: 20 }}>
          <Text style={{ marginVertical: 50, fontSize: 20 }}>Enter Your Code</Text>
          <TextInput
            autoFocus={true}
            onChangeText={code => this.setState({ code })}
            editable={true}
            keyboardType="phone-pad"
            style={{ height: 50, textAlign: 'center' }}
          />
          <View style={{ marginVertical: 50 }} />
          <Button text="Complete Payment" onPress={this.done} />
        </View>
        <Loader />
      </View>
    );
  }
}

export default CompleteManualPayment;
