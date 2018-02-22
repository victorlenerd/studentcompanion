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
  StyleSheet,
  AppState,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import Tts from 'react-native-tts';
import DeviceInfo from 'react-native-device-info';
import PushNotification from 'react-native-push-notification';
import { main, colors } from 'shared/styles';

const { height, width } = Dimensions.get('window');

const supportsQuill = () => {
  const deviceType = DeviceInfo.getSystemName();
  const deviceVersion = DeviceInfo.getSystemVersion();

  return (deviceType === 'iOS' && parseFloat(deviceVersion) >= 9.0) ||
    (deviceType === 'Android' && parseFloat(deviceVersion) >= 5.1);
};

let notificationInterval;

class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      sentences: [],
      comments: [],
      usingWebView: false,
      light: true,
      currentSentence: 0,
      appState: AppState.currentState,
    };
  }

  async componentWillUnmount() {
    const { getComments, currentNote: { $id } } = this.props;

    this.setState({
      playing: false,
      currentSentence: 0,
      usingWebView: supportsQuill(),
      sentences: this.props.currentNote.text.split('.'),
    });

    AppState.removeEventListener('change', this._handleAppStateChange);

    Tts.addEventListener('tts-finish', event => {
      if (this.state.currentSentence < this.state.sentences.length - 1 && this.state.playing) {
        this.next();
      } else {
        this.setState({
          playing: false,
          currentSentence: 0,
        });
      }
    });

    try {
      const comments = await getComments($id);
      this.setState({ comments });
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }

    AppState.addEventListener('change', this._handleAppStateChange);
  }

  play() {
    if (this.state.playing) {
      this.setState({ playing: false });
      Tts.stop();
      if (this.state.usingWebView) this.webView.postMessage('pause.mode');
    } else {
      const startIndex = this.props.currentNote.text.indexOf(this.state.sentences[this.state.currentSentence]);
      const endIndex = this.props.currentNote.text.indexOf(this.state.sentences[this.state.currentSentence + 1]);

      this.setState({ playing: true });

      Tts.speak(this.state.sentences[this.state.currentSentence]);
      if (this.state.usingWebView) this.webView.postMessage(`${startIndex},${endIndex}, ${this.props.currentNote.text.length}`);
      if (this.state.usingWebView) this.webView.postMessage('play.mode');
    }
  }

  light() {
    if (this.state.light) {
      this.setState({ light: false });
      if (this.state.usingWebView) this.webView.postMessage('dark.mode');
    } else {
      this.setState({ light: true });
      if (this.state.usingWebView) this.webView.postMessage('light.mode');
    }
  }

  _handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if (notificationInterval !== undefined) clearInterval(notificationInterval);
    } else {
      const messages = [
        'No shortcuts. Work for it.',
        'Difficult roads often lead to beautiful destinations.',
        "Don't just dream about success work for it.",
      ];

      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      PushNotification.localNotification({
        title: 'Student Companion',
        message: randomMessage,
      });
    }

    this.setState({ appState: nextAppState });
  };

  _renderPlayButton() {
    if (this.state.playing) {
      return (
        <View>
          <Image source={require('../assets/pause.png')} style={{ width: 22, height: 32 }} resizeMode="contain" />
        </View>
      );
    }

    return (
      <View>
        <Image source={require('../assets/play.png')} style={{ width: 22, height: 32 }} resizeMode="contain" />
      </View>
    );
  }

  _renderNightButton() {
    if (this.state.light) {
      return (
        <View>
          <Image source={require('../assets/moon.png')} style={{ width: 22, height: 32 }} resizeMode="contain" />
        </View>
      );
    }

    return (
      <View>
        <Image source={require('../assets/sun.png')} style={{ width: 22, height: 32 }} resizeMode="contain" />
      </View>
    );
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
              Platform.OS === 'android'
                ? { uri: 'file:///android_asset/www/note.html' }
                : require('../assets/www/note.html')
            }
          />
        </View>
      );
    }
  }

  rateChange = v => {
    if (this.state.playing) this.play();
    Tts.setDefaultRate(v);
  }

  next = () => {
    if (this.state.currentSentence < this.state.sentences.length - 1 && this.state.playing) {
      Tts.stop();
      const currentSentence = this.state.currentSentence + 1;
      const startIndex = this.props.currentNote.text.indexOf(this.state.sentences[currentSentence]);
      const endIndex = this.props.currentNote.text.indexOf(this.state.sentences[currentSentence + 1]);

      this.setState({ currentSentence });

      Tts.speak(this.state.sentences[currentSentence]);
      if (this.state.usingWebView) this.webView.postMessage(`${startIndex},${endIndex}, ${this.props.currentNote.text.length}`);
    }
  }

  prev = () => {
    if (
      this.state.currentSentence >= 1 &&
      this.state.currentSentence < this.state.sentences.length - 1 &&
      this.state.playing
    ) {
      Tts.stop();
      const currentSentence = this.state.currentSentence - 1;
      const startIndex = this.props.currentNote.text.indexOf(this.state.sentences[currentSentence]);
      const endIndex = this.props.currentNote.text.indexOf(this.state.sentences[currentSentence + 1]);

      this.setState({ currentSentence });

      Tts.speak(this.state.sentences[currentSentence]);
      if (this.state.usingWebView) this.webView.postMessage(`${startIndex},${endIndex}, ${this.props.currentNote.text.length}`);
    }
  }

  comment = () => {
    this.props.navigation.navigate('Comments');
  }

  renderCommentsCount = () => {
    const kDNum = num => {
      const numStr = String(num);

      if (num > 999 && num < 9999) {
        numStr.substring(0, 1).concat('K');
      }

      if (num > 9999 && num < 99999) {
        numStr.substring(0, 2).concat('K');
      }

      if (num > 99999) {
        numStr.substring(0, 3).concat('K');
      }

      return num;
    };

    if (this.state.comments.length > 0) {
      return (
        <View
          style={style.commentCountBubble}
        >
          <Text style={{ fontSize: 8, color: colors.white }}>{kDNum(this.state.comments.length)}</Text>
        </View>
      );
    }
  }

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
        <View style={style.topAction}>
          <Text style={{ fontSize: 16, color: colors.white }}>Voice Rate</Text>
          <Slider
            ref={r => (this.slider = r)}
            style={{ width: width - 40 }}
            value={0.5}
            onValueChange={this.rateChange}
          />
        </View>
        {this._renderReaderView()}
        <View
          style={style.bttnsRow}
        >
          <TouchableOpacity
            style={style.bttns}
            onPress={this.light}
          >
            {this._renderNightButton()}
          </TouchableOpacity>
          <TouchableOpacity
            style={style.bttns}
            onPress={this.play}
          >
            {this._renderPlayButton()}
          </TouchableOpacity>
          <TouchableOpacity
            style={style.bttns}
            onPress={this.comment}
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

const style = StyleSheet.create({
  topAction: {
    width: width,
    backgroundColor: colors.black,
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: 80,
  },
  bttnsRow: {
    width,
    height: 60,
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bttns: {
    width: 50,
    height: 50,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  commentCountBubble: {
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
  }
});

export default Note;
