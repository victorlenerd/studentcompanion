import React, { Component } from 'react';
import { View, WebView, Alert } from 'react-native';

import { main, colors } from 'shared/styles';

import Loader from 'components/loader';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loaded: false,
    };
  }

  componentDidMount() {
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

  onLoadIos() {
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
        source={{ uri: 'https://universitypastquestions.com/payment' }}
      />
    );
  }

  render() {
    return (
      <View style={[main.container, { backgroundColor: colors.white }]}>
        <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>{this._renderWebview()}</View>
        <Loader />
      </View>
    );
  }
}

export default Payment;
