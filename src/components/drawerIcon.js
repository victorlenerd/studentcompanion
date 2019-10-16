import React, { Component } from 'react';
import { Image, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';

import drawerIcon from 'containers/drawerIcon';

const menuIcon = require('../assets/menu.png');
const backIcon = require('../assets/left-arrow.png');

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

  componentDidUpdate() {}

  handleBackButton = () => {
    const { to } = this.state;
    const { props: { navigation } } = this;
    navigation.goBack(null);
  }

  render() {
    const { menu } = this.state;
    // if (menu) {
      return (
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            this.props.navigation.toggleDrawer();
          }}
        >
          <Image style={style.menuIcon} source={menuIcon} />
        </TouchableOpacity>);
    // }

    // return (
    //   <TouchableOpacity
    //     onPress={() => {
    //      this.handleBackButton();
    //       }}
    //   >
    //     <Image style={style.menuIcon} source={backIcon} />
    //   </TouchableOpacity>);
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
