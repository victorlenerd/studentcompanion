import React, { Component } from 'react';
import { View, Alert, Text, TouchableOpacity, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';
import RNPaystack from 'react-native-paystack';


import { main, colors } from 'shared/styles';

import Loader from 'components/loader';
import AppInput from 'components/inputs/AppInput';


import users from 'containers/users';
import connection from 'containers/connection';

const BLUE = '#428AF8';
const LIGHT_GRAY = '#D3D3D3';

@users
@connection
class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loaded: false,
      isFocused: false
    };
  }

  componentDidMount() {
    RNPaystack.init({ publicKey: 'pk_test_3ad48b1d0eb101873e7947fe5287ae4331dbbb16' });
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

  onLoad(e) {
    this.setState({ loaded: true }, () => this.webView.injectJavaScript('window.onLoad()'));
    this.webView.postMessage(
      JSON.stringify({
        email: this.state.email,
        price: this.props.price,
      })
    );
  }
  onPay = async () => {
    try {
      const response = await RNPaystack.chargeCardWithAccessCode({
        cardNumber: '4123450131001381',
        expiryMonth: '10',
        expiryYear: '19',
        cvc: '883',
        accessCode: 't61tq2c0w7njlk6'
      });
      console.log(response, 'payment response');
    } catch (err) {
      console.log(err);
    }
  }

  onLoadIos = () => {
    if (this.state.loaded) return;

    this.setState({ loaded: true }, () => this.webView.injectJavaScript('window.onLoad()'));
    this.webView.postMessage(
      JSON.stringify({
        email: this.state.email,
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
        .pay(this.state.email, this.props.amount)
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

  handleInputChange = () => {

  }

  renderCardView() {
    const { isFocused } = this.state;
    return (
      <View>
        <AppInput
          onChangeText={input => this.handleInputChange(input, 'email')}
          placeholder="Email"
          errors={[]}
          label="Card number"
          showLabel
          textAlignVertical={false}
          style={{ margin: 0, paddingBottom: 6 }}
        />
        <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
          <AppInput
            onChangeText={input => this.handleInputChange(input, 'email')}
            placeholder="MM/YY"
            errors={[]}
            label=""
            showLabel={false}
            textAlignVertical={true}
            baseWidth="50%"
            style={{ margin: 0, paddingBottom: 6 }}
          />
          <AppInput
            onChangeText={input => this.handleInputChange(input, 'email')}
            placeholder="CCV"
            errors={[]}
            label=""
            showLabel={false}
            baseWidth="50%"
            textAlignVertical={false}
          />
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={[main.container, { backgroundColor: colors.white }]}>
        <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
          <View style={{ flex: 1, paddingTop: 40 }}>
            {this.renderCardView()}
          </View>
          <TouchableOpacity onPress={this.onPay}>
            <Text>Pay Now</Text>
          </TouchableOpacity>
        </View>
        <Loader />
      </View>
    );
  }
}

export default Payment;
