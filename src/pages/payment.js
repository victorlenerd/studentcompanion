import React, { Component, Fragment } from 'react';
import { View, Alert, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import RNPaystack from 'react-native-paystack';
import firebase from 'react-native-firebase';
import moment from 'moment';


import { main, colors } from 'shared/styles';

import Loader from 'components/loader';
import AppInput from 'components/inputs/AppInput';
import ButtonWithIndicator from 'components/buttons/ButtonIndicator';


import users from 'containers/users';
import connection from 'containers/connection';
import resetToWelcome from '../helpers/redirect';


@users
@connection
class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { email: '' },
      loaded: false,
      card: {
        cardNumber: '',
        expiryDate: '',
        cvc: '',
      },
      step: 1,
      errors: [],
      isSubmitting: false,
    };
    this.inputs = [];
  }

  componentDidMount() {
    RNPaystack.init({ publicKey: 'pk_test_ae7c42d5583b3f3e4634cba70fa046792e038abc' });
    this.props
      .getCurrentUser()
      .then(user => {
        this.setState({
          user
        });
      })
      .catch(err => {
        Alert.alert('System error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
      });
  }

  onLoad(e) {
    this.setState({ loaded: true }, () => this.webView.injectJavaScript('window.onLoad()'));
    this.webView.postMessage(
      JSON.stringify({
        email: this.state.user.email,
        price: this.props.price,
      })
    );
  }

  // eslint-disable-next-line react/sort-comp
  getPaymentAccessCode(amount) {
    return firebase
      .functions()
      .httpsCallable('initializePayStack')({
        email: this.state.user.email,
        amount: amount * 10000
      });
  }

  // eslint-disable-next-line react/sort-comp
  async verifyPayment(reference) {
    const result = await firebase
      .functions()
      .httpsCallable('verifyPayStackPayment')({
        reference
      });
    return result.data;
  }

  updatePaymentInfo(navigation) {
    const { user } = this.state;
    const paymentType = navigation.getParam('paymentType', 'monthly');
    let numberOfDays;
    if (paymentType === 'annually') {
      numberOfDays = 365;
    } else {
      numberOfDays = 93;
    }
    const nextPaymentDate = moment().add(numberOfDays, 'days');
    return firebase
      .functions()
      .httpsCallable('updatePaymentInfo')({
        user,
        nextPaymentDate: nextPaymentDate.toISOString(),
      });
  }

    // eslint-disable-next-line react/sort-comp
    onPay = async () => {
      const { card } = this.state;
      const [ expiryMonth, expiryYear] = card.expiryDate.split('/');
      const { navigation, startRequest, finishRequest } = this.props;
      startRequest();
      const amount = navigation.getParam('amount', 1000);
      try {
        const result = await this.getPaymentAccessCode(amount);
        const { data: { access_code } } = result;
        const { reference } = await RNPaystack.chargeCardWithAccessCode({
          ...card,
          expiryMonth,
          expiryYear,
          accessCode: access_code
        });
        const paymentStatus = await this.verifyPayment(reference);
        if (paymentStatus.status === 'success') {
          await this.updatePaymentInfo(navigation);
          finishRequest();
          Alert.alert('Success', 'Your payment was successful you can now access all the courses you want.', [
            { text: 'Ok' },
          ]);
          resetToWelcome(navigation);
        }
      } catch (err) {
        finishRequest();
        Alert.alert('An Error Occured', 'Problem completing your payment request', [{ text: 'Cancel', style: 'cancel' }]);
      }
    }

  onLoadIos = () => {
    if (this.state.loaded) return;

    this.setState({ loaded: true }, () => this.webView.injectJavaScript('window.onLoad()'));
    this.webView.postMessage(
      JSON.stringify({
        email: this.state.user.email,
        price: this.props.amount,
      })
    );
  }

  _Message(event) {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.success) {
      Alert.alert('Success', 'Your payment was successful you can now access all the courses you want.', [
        { text: 'Ok' },
      ]);

      this.props
        .pay(this.state.user.email, this.props.amount)
        .then(() => {
          navigator.welcome();
        })
        .catch(err => {
          Alert.alert('An Error Occured', err.message, [{ text: 'Cancel', style: 'cancel' }]);
        });
    } else {
      navigator.activateAccount();
    }

    if (data.message === 'load') {
      this.props.finishRequest();
    }
  }

  _renderWebview() {
    const patchPostMessageFunction = function() {
      const originalPostMessage = window.postMessage;

      const patchedPostMessage = function(message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
      };

      patchedPostMessage.toString = function() {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
      };

      window.postMessage = patchedPostMessage;
    };

    const patchPostMessageJsCode = `(${String(patchPostMessageFunction)} )();`;

    return (
      <WebView
        ref={e => {
          this.webView = e;
        }}
        style={{ flex: 1 }}
        injectedJavaScript={patchPostMessageJsCode}
        onMessage={this.state.loaded ? this._Message : null}
        onLoad={this.onLoadIos}
        javaScriptEnabled={true}
        mediaPlaybackRequiresUserAction={true}
        source={{ uri: 'http://127.0.0.1:5500/index.html' }}
      />
    );
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  formatCardInput(cardNumber) {
    const cardInputGroup = cardNumber.replace(/-/g, '').match(/.{1,4}/g);
    const cardLength = cardInputGroup.join('').length;
    const formatedCardNumber = cardNumber ? cardInputGroup.join('-') : '';
    const currentStep = cardLength === 16 ? 2 : 1;
    this.setState(state => ({
      ...state,
      step: currentStep,
      card: {
        ...state.card,
        cardNumber: formatedCardNumber
      }
    }), () => this.focusNextField(`input${currentStep}`));
  }

  formateDateInput(expiryDate) {
    const dateInputGroup = expiryDate.replace(/\//g, '').match(/.{1,2}/g);
    const cardLength = dateInputGroup.join('').length;
    const formatedExpiryDate = expiryDate ? dateInputGroup.join('/') : '';
    const currentStep = cardLength === 4 ? 3 : 2;
    this.setState(state => ({
      ...state,
      step: currentStep,
      card: {
        ...state.card,
        expiryDate: formatedExpiryDate
      }
    }), () => this.focusNextField(`input${currentStep}`));
  }

  formatCVC(cvc) {
    this.setState(state => ({
      ...state,
      card: {
        ...state.card,
        cvc
      }
    }));
  }

  getCurrentInput(type, input) {
    if (type === 'cardNumber') {
      this.formatCardInput(input);
      return;
    }
    if (type === 'expiryDate') {
      this.formateDateInput(input);
      return;
    }
    this.formatCVC(input);
  }

  handleInputChange = (input, type) => {
    this.getCurrentInput(type, input);
  }

  renderCardView() {
    const { isSubmitting, card: { expiryDate, cvc, cardNumber } } = this.state;
    const { navigation, isLoading } = this.props;
    return (
      <View style={{ marginTop: 40 }}>
        { !isLoading &&
        <Fragment>
          <AppInput
            onChangeText={input => this.handleInputChange(input, 'cardNumber')}
            value={cardNumber}
            placeholder="card number"
            errors={[]}
            label="card number"
            keyboardType="numeric"
            showLabel={true}
            maxLength={19}
            ref={input => {
            this.inputs.input1 = input;
          }}
            onFocus={() => this.setState(state => ({ ...state, step: 1 }))}
            style={{ margin: 0, paddingBottom: 6, fontSize: 25 }}
          />
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
              <AppInput
                onChangeText={input => this.handleInputChange(input, 'expiryDate')}
                value={expiryDate}
                ref={input => {
                this.inputs.input2 = input;
              }}
                onFocus={() => this.setState(state => ({ ...state, step: 2 }))}
                keyboardType="numeric"
                placeholder="mm/yy"
                errors={[]}
                label="mm/yy"
                showLabel={true}
                baseWidth="50%"
                maxLength={5}
                style={{ margin: 0, paddingBottom: 6, fontSize: 25 }}
              />
            </View>
            <AppInput
              onChangeText={input => this.handleInputChange(input, 'cvc')}
              value={cvc}
              placeholder="cvc"
              ref={input => {
              this.inputs.input3 = input;
            }}
              onFocus={() => this.setState(state => ({ ...state, step: 4 }))}
              keyboardType="numeric"
              errors={[]}
              label="cvc"
              showLabel={true}
              baseWidth="50%"
              maxLength={3}
              style={{ margin: 0, paddingBottom: 6, fontSize: 25 }}

            />
          </View>
          <View style={{ alignItems: 'center' }}>
            <ButtonWithIndicator
              disabled={isSubmitting}
              text="Proceed to pay with card"
              style={{ button: { width: '80%' } }}
              onPress={() => this.onPay()}
            />
            <Text>Or</Text>
            <ButtonWithIndicator
              disabled={isSubmitting}
              text="Continue payment offline"
              style={{ button: { width: '80%' } }}
              onPress={() => navigation.navigate('CompleteManualPayment')}
            />
          </View>
        </Fragment>
      }
      </View>
    );
  }

  render() {
    const { isSubmitting } = this.state;
    return (
      <View style={[main.container, { backgroundColor: colors.white }]}>
        {!isSubmitting &&
          <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
            <View style={{ flex: 1, paddingTop: 40 }}>
              {this.renderCardView()}
            </View>
          </View>
        }
        <Loader />
      </View>
    );
  }
}

export default Payment;
