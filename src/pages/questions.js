import React, { Component } from 'react';
import { View, WebView, Platform } from 'react-native';
import { main, colors } from 'shared/styles';

import questions from 'containers/questions';

@questions
class Questions extends Component {
  componentDidMount() {
    // const Bodify = body => {
    //   return JSON.parse('' + body + '', (key, value) => {
    //     if (typeof value === 'string') {
    //       return unescape(value);
    //     }
    //     return value;
    //   });
    // };

    // this.setState({
    //   questions: this.props.questions.map((question, i) => {
    //     question.question = Bodify(JSON.stringify(question.question));

    //     question.answers = question.answers.map((answer, i) => {
    //       answer.answer = Bodify(JSON.stringify(answer.answer));
    //       return answer;
    //     });

    //     return question;
    //   }),
    // });
  }

  render() {
    return (
      <View
        style={[
          main.container,
          { padding: 20, backgroundColor: colors.white, borderTopColor: colors.accent, borderTopWidth: 2 },
        ]}
      >
        <WebView
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          injectedJavaScript={`window.ContentBody(${JSON.stringify(this.props.questions)})`}
          mediaPlaybackRequiresUserAction={true}
          source={
            Platform.OS === 'android'
              ? { uri: 'file:///android_asset/www/index.html' }
              : require('../assets/www/index.html')
          }
        />
      </View>
    );
  }
}

export default Questions;
