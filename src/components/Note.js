import React, { Component } from 'react';
import {
  View,
  Text,
  WebView,
  Image,
  ScrollView,
  Platform,
  Slider,
  Alert,
  AppState,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux';

import { navigator } from '../shared/Navigation';
import { main, colors } from '../shared/styles';

import { StartRequest, FinishRequest } from '../ducks/Request';
import { GetComments } from '../ducks/Comments';
import Tts from 'react-native-tts';

var { height, width } = Dimensions.get('window');
var DeviceInfo = require('react-native-device-info');

import PushNotification from 'react-native-push-notification';

let supportsQuill = () => {
  let deviceType = DeviceInfo.getSystemName();
  let deviceVersion = DeviceInfo.getSystemVersion();

  return (deviceType == 'iOS' && parseFloat(deviceVersion) >= 9.0) ||
    (deviceType == 'Android' && parseFloat(deviceVersion) >= 5.1)
    ? true
    : false;
};

let notificationInterval;

class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: {},
      playing: false,
      sentences: [],
      comments: [],
      usingWebView: false,
      light: true,
      startIndex: 0,
      endIndex: 0,
      currentSentence: 0,
      appState: AppState.currentState,
    };
  }

  play() {
    if (this.state.playing) {
      this.setState({ playing: false });
      Tts.stop();
      if (this.state.usingWebView) this.webView.postMessage('pause.mode');
    } else {
      let startIndex = this.props.currentNote.text.indexOf(this.state.sentences[this.state.currentSentence]);
      let endIndex = this.props.currentNote.text.indexOf(this.state.sentences[this.state.currentSentence + 1]);

      this.setState({ playing: true });

      Tts.speak(this.state.sentences[this.state.currentSentence]);
      if (this.state.usingWebView)
        this.webView.postMessage(`${startIndex},${endIndex}, ${this.props.currentNote.text.length}`);
      if (this.state.usingWebView) this.webView.postMessage('play.mode');
    }
  }

  light() {
    if (this.state.light) {
      this.setState({ light: false });
      if (this.state.usingWebView) this.webView.postMessage(`dark.mode`);
    } else {
      this.setState({ light: true });
      if (this.state.usingWebView) this.webView.postMessage(`light.mode`);
    }
  }

  componentWillUnmount() {
    this.setState({
      playing: false,
      startIndex: 0,
      currentSentence: 0,
      usingWebView: supportsQuill(),
    });
  }

  componentDidMount() {
    this.setState({
      sentences: this.props.currentNote.text.split('.'),
      usingWebView: supportsQuill(),
    });

    Tts.addEventListener('tts-finish', event => {
      if (this.state.currentSentence < this.state.sentences.length - 1 && this.state.playing) {
        this.next();
      } else {
        this.setState({
          playing: false,
          startIndex: 0,
          endIndex: 0,
          currentSentence: 0,
        });
      }
    });

    this.props
      .getComments(this.props.currentNote.$id)
      .then(comments => {
        this.setState({ comments });
        this.props.finishRequest();
      })
      .catch(err => {
        Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
        this.props.finishRequest();
      });

    AppState.addEventListener('change', this._handleAppStateChange);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if (notificationInterval !== undefined) clearInterval(notificationInterval);
    } else {
      var messages = [
        'No shortcuts. Work for it.',
        'Go Fucking Read. Your Dreams Are Dying.',
        'Difficult roads often lead to beautiful destinations.',
        "KNOCK KNOCK. WHO'S THERE? FUCK YOU. READ",
        "Don't just dream about success work for it.",
        'YOU LOSER. FUCKING READ',
      ];

      var randomMessage = messages[Math.floor(Math.random() * messages.length)];

      PushNotification.localNotification({
        title: 'Student Companion',
        message: randomMessage,
      });
    }

    this.setState({ appState: nextAppState });
  };

  onNavigatorEvent(event) {
    if (event.id === 'menu' && !this.state.drawerOpen) {
      this.props.navigator.toggleDrawer({
        side: 'left',
        animated: true,
        to: 'open',
      });
      this.setState({ drawerOpen: true });
    } else {
      this.props.navigator.toggleDrawer({
        side: 'left',
        animated: true,
        to: 'closed',
      });
      this.setState({ drawerOpen: false });
    }
  }

  _renderPlayButton() {
    if (this.state.playing) {
      return (
        <View>
          <Image source={require('../assets/pause.png')} style={{ width: 22, height: 32 }} resizeMode="contain" />
        </View>
      );
    } else {
      return (
        <View>
          <Image source={require('../assets/play.png')} style={{ width: 22, height: 32 }} resizeMode="contain" />
        </View>
      );
    }
  }

  _renderNightButton() {
    if (this.state.light) {
      return (
        <View>
          <Image source={require('../assets/moon.png')} style={{ width: 22, height: 32 }} resizeMode="contain" />
        </View>
      );
    } else {
      return (
        <View>
          <Image source={require('../assets/sun.png')} style={{ width: 22, height: 32 }} resizeMode="contain" />
        </View>
      );
    }
  }

  _renderReaderView() {
    if (!this.props.isImages) {
      if (!supportsQuill()) {
        return (
          <ScrollView style={{ flex: 1 }}>
            <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
              <Text
                style={{
                  fontSize: 18,
                  paddingBottom: 50,
                  paddingTop: 50,
                  color: this.state.light ? colors.black : colors.white,
                }}
              >
                {this.props.currentNote.text}
              </Text>
            </View>
          </ScrollView>
        );
      }

      return (
        <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
          <WebView
            ref={e => {
              this.webView = e;
            }}
            style={{ flex: 1, height, paddingBottom: 100, paddingTop: 100 }}
            javaScriptEnabled={true}
            injectedJavaScript={`window.ContentBody(${JSON.stringify(this.props.currentNote)})`}
            mediaPlaybackRequiresUserAction={true}
            source={
              Platform.OS == 'android'
                ? { uri: 'file:///android_asset/www/note.html' }
                : require('../assets/www/note.html')
            }
          />
        </View>
      );
    }
  }

  rateChange(v) {
    if (this.state.playing) this.play();
    Tts.setDefaultRate(v);
  }

  next() {
    if (this.state.currentSentence < this.state.sentences.length - 1 && this.state.playing) {
      Tts.stop();
      let currentSentence = this.state.currentSentence + 1;
      let startIndex = this.props.currentNote.text.indexOf(this.state.sentences[currentSentence]);
      let endIndex = this.props.currentNote.text.indexOf(this.state.sentences[currentSentence + 1]);

      this.setState({ currentSentence });

      Tts.speak(this.state.sentences[currentSentence]);
      if (this.state.usingWebView)
        this.webView.postMessage(`${startIndex},${endIndex}, ${this.props.currentNote.text.length}`);
    }
  }

  prev() {
    if (
      this.state.currentSentence >= 1 &&
      this.state.currentSentence < this.state.sentences.length - 1 &&
      this.state.playing
    ) {
      Tts.stop();
      let currentSentence = this.state.currentSentence - 1;
      let startIndex = this.props.currentNote.text.indexOf(this.state.sentences[currentSentence]);
      let endIndex = this.props.currentNote.text.indexOf(this.state.sentences[currentSentence + 1]);

      this.setState({ currentSentence });

      Tts.speak(this.state.sentences[currentSentence]);
      if (this.state.usingWebView)
        this.webView.postMessage(`${startIndex},${endIndex}, ${this.props.currentNote.text.length}`);
    }
  }

  summarised() {
    navigator.summarised(this.props, this.props.currentNote.title, this.props.currentNote.text);
  }

  comment() {
    navigator.comments(this.props);
  }

  renderCommentsCount() {
    let kDNum = num => {
      var numStr = String(num);

      if (num > 999 && num < 9999) {
        return numStr.substring(0, 1).concat('K');
      } else if (num > 9999 && num < 99999) {
        return numStr.substring(0, 2).concat('K');
      } else if (num > 99999) {
        return numStr.substring(0, 3).concat('K');
      } else {
        return num;
      }
    };

    if (this.state.comments.length > 0) {
      return (
        <View
          style={{
            width: 25,
            justifyContent: 'center',
            alignItems: 'center',
            height: 25,
            borderRadius: 12.5,
            backgroundColor: '#e74c3c',
            zIndex: 100,
            position: 'absolute',
            top: -5,
            right: -10,
          }}
        >
          <Text style={{ fontSize: 8, color: colors.white }}>{kDNum(this.state.comments.length)}</Text>
        </View>
      );
    }
  }

  share() {}

  render() {
    return (
      <View
        style={[
          main.container,
          {
            backgroundColor: this.state.light ? colors.white : colors.black,
            borderTopColor: colors.accent,
            borderTopWidth: 2,
          },
        ]}
      >
        <View
          style={{
            width: width,
            backgroundColor: colors.black,
            paddingRight: 20,
            paddingLeft: 20,
            paddingTop: 20,
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            height: 80,
          }}
        >
          <Text style={{ fontSize: 16, color: colors.white }}>Voice Rate</Text>
          <Slider
            ref={r => (this.slider = r)}
            style={{ width: width - 40 }}
            value={0.5}
            onValueChange={this.rateChange.bind(this)}
          />
        </View>
        {this._renderReaderView()}
        <View
          style={{
            width,
            height: 60,
            flexDirection: 'row',
            paddingLeft: 20,
            paddingRight: 20,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              backgroundColor: colors.gray,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 25,
            }}
            onPress={this.light.bind(this)}
          >
            {this._renderNightButton()}
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              backgroundColor: colors.black,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 25,
            }}
            onPress={this.play.bind(this)}
          >
            {this._renderPlayButton()}
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              backgroundColor: colors.black,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 25,
            }}
            onPress={this.comment.bind(this)}
          >
            <View>
              {this.renderCommentsCount()}
              <Image
                source={require('../assets/bubble-white.png')}
                style={{ width: 22, height: 32 }}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    startRequest: () => {
      dispatch(StartRequest());
    },
    finishRequest: () => {
      dispatch(FinishRequest());
    },
    getComments: noteId => {
      return dispatch(GetComments('note', noteId));
    },
  };
};

const mapStateToProps = store => {
  return {
    currentNote: store.notesState.currentNote,
    currentCourse: store.courseState.currentCourse,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Note);
