import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
  Alert,
  AppState,
  BackHandler,
  Dimensions
} from 'react-native';
import { WebView } from 'react-native-webview';


import Tts from 'react-native-tts';
import DeviceInfo from 'react-native-device-info';
// import PushNotification from 'react-native-push-notification';
import { main, colors } from 'shared/styles';

import notes from 'containers/notes';
import comments from 'containers/comments';
import reader from 'containers/reader';

import VoiceRatePane from 'components/voiceRatePane';
import Tracking from 'shared/tracking';
import withBackHandler from '../helpers/withBackHandler';

const { height } = Dimensions.get('window');

const supportsQuill = () => {
  const deviceType = DeviceInfo.getSystemName();
  const deviceVersion = DeviceInfo.getSystemVersion();

  return (deviceType === 'iOS' && parseFloat(deviceVersion) >= 9.0) ||
    (deviceType === 'Android' && parseFloat(deviceVersion) >= 5.1);
};

@notes
@comments
@reader
class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      sentences: [],
      usingWebView: false,
      themeMode: 'light',
      currentSentence: 0
    };
  }

  async componentWillMount() {
    const { getComments, currentNote, setCommentsCount, setPlayMode } = this.props;
    const { $id } = currentNote;

    Tracking.setCurrentScreen('Page_Note');

    this.setState({
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
          currentSentence: 0,
        });
        setPlayMode(false);
      }
    });

    try {
      const noteComments = await getComments($id);
      setCommentsCount(noteComments.length);
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { themeMode, playing } = nextProps;

    if (themeMode !== this.state.themeMode && this.state.usingWebView) {
      this.setState({ themeMode });
      this.webView.postMessage(`${themeMode}.mode`);
    }

    if (this.state.playing !== playing && playing) {
      const startIndex = this.props.currentNote.text.indexOf(this.state.sentences[this.state.currentSentence]);
      const endIndex = this.props.currentNote.text.indexOf(this.state.sentences[this.state.currentSentence + 1]);

      Tts.speak(this.state.sentences[this.state.currentSentence]);
      if (this.state.usingWebView) this.webView.postMessage(`${startIndex},${endIndex}, ${this.props.currentNote.text.length}`);
      if (this.state.usingWebView) this.webView.postMessage('play.mode');
      this.setState({ playing });
    }

    if (this.state.playing !== playing && !playing) {
      Tts.stop();
      if (this.state.usingWebView) this.webView.postMessage('pause.mode');
      this.setState({ playing });
    }
  }

  componentWillUnmount() {
    Tts.stop();
    BackHandler.removeEventListener('hardwareBackPress');
  }

  _handleAppStateChange = nextAppState => {
    // if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
    //   if (notificationInterval !== undefined) clearInterval(notificationInterval);
    // } else {
    //   const messages = [
    //     'No shortcuts. Work for it.',
    //     'Difficult roads often lead to beautiful destinations.',
    //     "Don't just dream about success work for it.",
    //   ];

    //   const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    //   PushNotification.localNotification({
    //     title: 'Student Companion',
    //     message: randomMessage,
    //   });
    // }

    // this.setState({ appState: nextAppState });
  };

  _renderReaderView = () => {
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
    if (this.props.playing) this.play();
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

  render() {
    return (
      <View
        style={[
          main.container,
          {
            backgroundColor: this.state.themeMode === 'light' ? colors.white : colors.black,
            borderTopColor: colors.accent,
            borderTopWidth: 2,
          },
        ]}
      >
        <VoiceRatePane change={this.rateChange} />
        {this._renderReaderView()}
      </View>
    );
  }
}

export default withBackHandler(Note, 'Course');
