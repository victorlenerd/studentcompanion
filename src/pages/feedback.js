import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  Dimensions,
  StatusBar
} from 'react-native';

import { main, colors } from 'shared/styles';
import { Button } from 'components/buttons';
import Loader from 'components/loader';
import users from 'containers/users';
import connection from 'containers/connection';

const { width, height } = Dimensions.get('window');

@users
@connection
class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedback: '',
      submitted: false,
    };
  }

  _submit = async () => {
    this.setState({ submitted: true });
    const { sendFeedback, currentUser: { $id } } = this.props;
    if (this.state.feedback.length > 1) {
      try {
        await sendFeedback($id, this.state.feedback);
        Alert.alert('Sent', 'Thanks for the feedback.', [{ text: 'Ok', style: 'cancel' }]);
        this.setState({ submitted: false });
      } catch (err) {
        Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
      }
    }
  }

  renderOfflineBanner() {
    if (!this.props.isConnected) {
      return (
        <View style={{ width, height: 80, paddingLeft: 20, justifyContent: 'center', backgroundColor: colors.red }}>
          <Text style={{ color: colors.white, fontSize: 22, fontWeight: '300' }}>You are offline!</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <View
        style={{
          width,
          height,
          flexDirection: 'column',
          backgroundColor: colors.lightBlue,
          borderTopColor: colors.accent,
          borderTopWidth: 2,
        }}
      >
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        {this.renderOfflineBanner()}
        <View style={{ height: 300, padding: 20 }}>
          <TextInput
            autoCapitalize="none"
            placeholder="Type your feedback here"
            multiline={true}
            textAlignVertical="top"
            underlineColorAndroid="rgba(0, 0, 0, 0)"
            blurOnSubmit={false}
            editable={true}
            onChange={e => this.setState({ feedback: e.nativeEvent.text })}
            style={[
              main.textInput,
              {
                height: 300,
                backgroundColor: this.state.submitted && this.state.feedback.length < 1 ? colors.red : colors.lightBlue,
                fontSize: 18,
              },
            ]}
          />
        </View>
        <View style={{ padding: 20, marginBottom: 50 }}>
          <Button text="Submit" onPress={() => this._submit()} />
        </View>
        <Loader />
      </View>
    );
  }
}

export default Feedback;
