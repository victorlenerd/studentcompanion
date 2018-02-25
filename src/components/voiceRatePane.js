import React, { Component } from 'react';
import { View, Text, StyleSheet, Slider, Dimensions } from 'react-native';

import { colors } from 'shared/styles';
import reader from 'containers/reader';

const { width } = Dimensions.get('window');

@reader
class VoiceRatePane extends Component {
  state = { showVoicePane: false }
  componentWillReceiveProps(nextProps) {
    const { showVoicePane } = nextProps;
    if (this.state.showVoicePane !== showVoicePane) {
      this.setState({ showVoicePane });
    }
  }
  render() {
    if (!this.state.showVoicePane) return null;

    return (
      <View style={style.topAction}>
        <Text style={{ fontSize: 16, color: colors.white }}>Voice Rate</Text>
        <Slider
          ref={r => (this.slider = r)}
          style={{ width: width - 40 }}
          value={0.5}
          onValueChange={this.props.change}
        />
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
    height: 80
  }
});

export default VoiceRatePane;
