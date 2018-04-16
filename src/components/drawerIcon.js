import React, { Component } from 'react';
import { Image, TouchableOpacity, StyleSheet, Keyboard, Text } from 'react-native';

import drawerIcon from 'containers/drawerIcon';

@drawerIcon
class DrawerIcon extends Component {
  state = {
    menu: true,
    to: null
  }

  componentWillReceiveProps(nextProps) {
    const { drawerMenu: newMenu, back } = nextProps;
    this.setState({ menu: newMenu, to: back });
  }

  render() {
    const { menu, to } = this.state;

    if (menu) {
      return (
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            this.props.navigation.navigate('DrawerToggle');
          }}
        >
          <Image style={style.menuIcon} source={require('../assets/menu.png')} />
        </TouchableOpacity>);
    }

    return (
      <TouchableOpacity
        onPress={() => {
            this.props.navigation.navigate(to);
          }}
      >
        <Image style={style.menuIcon} source={require('../assets/left-arrow.png')} />
      </TouchableOpacity>);
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
