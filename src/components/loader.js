import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { LoadingIndicator } from 'shared/styles';

import connection from 'containers/connection';

@connection
class Loader extends Component {
  render() {
    if (this.props.isLoading) {
      return (
        <View style={LoadingIndicator.container}>
          <ActivityIndicator
            color="#fff"
            size="large"
            style={LoadingIndicator.loader}
          />
        </View>
      );
    }

    return null;
  }
}

export default Loader;
