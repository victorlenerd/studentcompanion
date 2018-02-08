import React, { Component } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { main } from 'shared/styles';

import Loader from 'components/loader';
import { Button } from 'components/buttons';
import auth from 'containers/auth';

@auth
class Pass extends Component {
  constructor(props) {
    super(props);
    this.state = { code: '' };
  }

  done = async () => {
    const { updateDeviceId, navigator: { navigate } } = this.props;

    if (this.state.code.length < 1) {
      Alert.alert('Err! Invalid Code', 'You cannote submit an empty text', [{ text: 'Cancel', style: 'cancel' }]);
    }

    try {
      await updateDeviceId(this.state.code);
      navigate('SearchCourses');
    } catch (err) {
      Alert.alert('An Error Occured', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
  };

  render() {
    return (
      <View style={main.container}>
        <View style={{ padding: 20 }}>
          <Text style={{ marginVertical: 50, fontSize: 20 }}>Enter Your Code</Text>
          <TextInput
            autoFocus={true}
            onChangeText={code => this.setState({ code })}
            editable={true}
            style={{ height: 50 }}
          />
          <View style={{ marginVertical: 50 }} />
          <Button text="DONE" onPress={this.done} />
        </View>
        <Loader />
      </View>
    );
  }
}

export default Pass;
