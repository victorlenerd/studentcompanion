import React, { Component } from 'react';
import {
  BackHandler,
  Alert
} from 'react-native';
import drawerIcon from 'containers/drawerIcon';

export default function withBackHandler(WrappedComponent, previousRoute) {
  @drawerIcon
  class Screen extends Component {
    // eslint-disable-next-line react/sort-comp
    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props) {
      super(props);
      this._didFocusSubscription = props.navigation.addListener(
        'didFocus',
        payload =>
          BackHandler.addEventListener(
            'hardwareBackPress',
            this.onBackButtonPressAndroid
          )
      );
    }

    async componentWillMount() {
      this._willBlurSubscription = this.props.navigation.addListener(
        'willBlur',
        payload =>
          BackHandler.removeEventListener(
            'hardwareBackPress',
            this.onBackButtonPressAndroid
          )
      );
    }

    componentWillUnmount() {
      this._didFocusSubscription && this._didFocusSubscription.remove();
      this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    onBackButtonPressAndroid = () => {
      if (previousRoute === 'exit') {
        this.handleBackButton();
        return true;
      } else if (previousRoute != '') {
        this.props.navigation.navigate(previousRoute);
        return true;
      }
      return false;
    }

    handleBackButton = () => {
      Alert.alert(
        'Close App',
        'Are you sure you want to close app', [{
          text: 'Cancel',
          style: 'cancel'
        }, {
          text: 'Yes',
          onPress: () => BackHandler.exitApp()
        } ], {
          cancelable: false
        }
      );
    }

    render() {
      return (
        <WrappedComponent {...this.props} />
      );
    }
  }
  return Screen;
}
