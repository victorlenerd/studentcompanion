import React, { Component } from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';

class DrawerIcon extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('DrawerToggle');
        }}
      >
        <Image style={style.menuIcon} source={require('../assets/menu.png')} />
      </TouchableOpacity>
    );
  }
}

const style = StyleSheet.create({
  menuIcon: {
    width: 22,
    height: 18,
    marginLeft: 20
  }
});

export default DrawerIcon;
