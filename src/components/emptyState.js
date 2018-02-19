import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

import { main } from 'shared/styles';

class EmptyState extends Component {
  render() {
    return (
      <View style={style.container}>
        <View style={[main.emptyState]}>
          <Text style={main.emptyStateText}>{this.props.message}</Text>
        </View>
      </View>
    );
  }
}

EmptyState.propTypes = {
  message: PropTypes.string
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default EmptyState;
