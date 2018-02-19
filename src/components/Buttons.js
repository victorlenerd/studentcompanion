import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { main } from 'shared/styles';

export class Button extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={main.button}>
          <Text style={main.buttonText}>{this.props.text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export class ButtonInActive extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={main.buttonInActive}>
          <Text style={main.buttonText}>{this.props.text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export class ButtonAccent extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={main.buttonAccent}>
          <Text style={[main.buttonText, { color: '#fff' }]}>{this.props.text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export class BlackButton extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={main.blackButton}>
          <Text style={main.blackButtonText}>{this.props.text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}