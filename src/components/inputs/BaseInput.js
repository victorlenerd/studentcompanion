import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  baseInput: {
    paddingVertical: 6,
    color: 'gray'
  },
});

const BaseInput = ({ children, label, showLabel, baseWidth }) => (
  <View style={[styles.baseInput, { width: baseWidth }]}>
    {showLabel && <Text>{label}</Text> }
    {children}
  </View>
);

export default BaseInput;

