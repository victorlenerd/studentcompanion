import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import { colors } from 'shared/styles';

class CourseTabBar extends Component {
  render() {
    return (
      <View style={style.container}>
        <TouchableOpacity style={style.tab}>
          <Text>Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.tab}>
          <Text>Papers</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    height: 60,
    backgroundColor: colors.brightBlue
  },
  tab: {
    flex: 0.5,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default CourseTabBar;
