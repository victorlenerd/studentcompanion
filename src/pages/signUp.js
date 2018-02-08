import React, { Component } from 'react';
import { View, Text, Image, Alert, TextInput } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { Button, ButtonInActive } from 'components/buttons';
import Loader from 'components/loader';
import { main, colors } from 'shared/styles';
import auth from 'containers/auth';

@auth
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      submitted: false,
    };

    this.signUp = this.signUp.bind(this);
  }

  signUp = async () => {
    const { navigation: { navigate }, signUp, userExist, validEmail, validPhone } = this.props;
    const { firstName, lastName, email, password, phoneNumber } = this.state;

    this.setState({ submitted: true });

    if (!(firstName.length < 1 || lastName.length < 1 || !validEmail(email) || !validPhone(phoneNumber) || password.length < 6)) {
      try {
        const isExistingUser = await userExist(this.state.email);
        if (isExistingUser) Alert.alert('Registration', 'Another user is registerred with this email', [{ text: 'Cancel', style: 'cancel' }]);
        await signUp(this.state.name, this.state.email, this.state.phoneNumber, this.state.password);
        navigate('AcademicInfo');
      } catch (err) {
        Alert.alert('Registration Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
      }
    }
  }

  renderError = (condition, text) => {
    return (condition) ? (<Text style={{ fontSize: 16, color: colors.red }}>{text}</Text>) : null;
  }

  render() {
    const { submitted, firstName, lastName, email, password, phoneNumber } = this.state;
    const { validEmail, validPhone } = this.props;

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
              <Text style={{ fontSize: 20, fontWeight: '300', color: colors.primary, marginBottom: 20 }}>Sign Up</Text>

              {this.renderError(submitted && firstName.length < 3, 'Your first name is required')}
              <TextInput
                placeholder="Name"
                underlineColorAndroid="rgba(0, 0, 0, 0)"
                style={[
                  main.textInput,
                  {
                    backgroundColor: submitted && firstName.length < 1 ? colors.red : colors.white,
                    paddingLeft: 10,
                  },
                ]}
                onChange={e => this.setState({ firstName: e.nativeEvent.text })}
              />

              {this.renderError(submitted && lastName.length < 1, 'Your last name is required')}
              <TextInput
                placeholder="Name"
                underlineColorAndroid="rgba(0, 0, 0, 0)"
                style={[
                  main.textInput,
                  {
                    backgroundColor: submitted && lastName.length < 3 ? colors.red : colors.white,
                    paddingLeft: 10,
                  },
                ]}
                onChange={e => this.setState({ lastName: e.nativeEvent.text })}
              />

              {this.renderError(submitted && !validEmail(email), 'Your email is required')}
              <TextInput
                placeholder="Email"
                underlineColorAndroid="rgba(0, 0, 0, 0)"
                autoCapitalize="none"
                style={[
                  main.textInput,
                  {
                    backgroundColor: submitted && !validEmail(email) ? colors.red : colors.white,
                    paddingLeft: 10,
                  },
                ]}
                onChange={e => this.setState({ email: e.nativeEvent.text })}
              />

              {this.renderError(submitted && !validEmail(this.state.email), 'Your phone number is required')}
              <TextInput
                placeholder="Phone Number"
                autoCapitalize="none"
                keyboardType="phone-pad"
                underlineColorAndroid="rgba(0, 0, 0, 0)"
                style={[
                  main.textInput,
                  {
                    backgroundColor: submitted && !validPhone(phoneNumber) ? colors.red : colors.white,
                    paddingLeft: 10,
                  },
                ]}
                onChange={e => this.setState({ phoneNumber: e.nativeEvent.text })}
              />

              {this._renderError(
                submitted && password.length < 6,
                'Your password is required, it should be more than six characters.'
              )}
              <TextInput
                placeholder="Password"
                underlineColorAndroid="rgba(0, 0, 0, 0)"
                secureTextEntry={true}
                style={[
                  main.textInput,
                  {
                    backgroundColor: submitted && password.length < 6 ? colors.red : colors.white,
                    paddingLeft: 10,
                  },
                ]}
                onChange={e => this.setState({ password: e.nativeEvent.text })}
              />
            </View>
            <View style={{ height: 100, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button text="Sign Up" onPress={this.signUp} />
            </View>
            <ButtonInActive onPress={() => this.props.navigation.navigate('SignIn')} text="I Already Have An Account" />
            <Text style={{ textAlign: 'center', color: '#999', fontSize: 16, marginTop: 20 }}>
              By signing up you agree to our terms and conditions.
            </Text>
          </View>
        </KeyboardAwareScrollView>
        <Loader />
      </View>
    );
  }
}

export default SignUp;
