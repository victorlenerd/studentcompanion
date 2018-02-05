import React, { Component } from 'react';
import { View, WebView, Platform, ActivityIndicator, Alert } from 'react-native';

import { connect } from 'react-redux';

import { navigator } from '../shared/Navigation';
import { main, colors } from '../shared/styles';

import { StartRequest, FinishRequest } from '../ducks/Request';
import { GetCurrentUser } from '../ducks/User';
import { MakePayment } from '../ducks/Price';

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
    console.log('e', e);
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
    let data = JSON.parse(event.nativeEvent.data);
    console.log('data', data);
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

    if (data.message == 'load') {
      this.props.finishRequest();
    }
  }

  renderIndicator() {
    if (this.props.isLoading) {
      return (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator
            color="#fff"
            size="large"
            style={{
              width: 60,
              height: 60,
              backgroundColor: colors.black,
              borderRadius: 6,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </View>
      );
    }
  }

  _renderWebview() {
    const patchPostMessageFunction = function() {
      var originalPostMessage = window.postMessage;

      var patchedPostMessage = function(message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
      };

      patchedPostMessage.toString = function() {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
      };

      window.postMessage = patchedPostMessage;
    };

    const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';

    return (
      <WebView
        ref={e => {
          this.webView = e;
        }}
        style={{ flex: 1 }}
        injectedJavaScript={patchPostMessageJsCode}
        onMessage={this.state.loaded ? this._Message.bind(this) : null}
        onLoad={this.onLoadIos.bind(this)}
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
        {this.renderIndicator()}
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCurrentUser: () => {
      return dispatch(GetCurrentUser());
    },
    pay: (email, amount) => {
      return dispatch(MakePayment(email, amount));
    },
    startRequest: () => {
      dispatch(StartRequest());
    },
    finishRequest: () => {
      dispatch(FinishRequest());
    },
  };
};

const mapStateToProps = store => {
  return {
    price: store.priceState.price,
    isLoading: store.requestState.status,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
