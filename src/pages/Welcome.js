import React, { Component } from 'react';
import { View, Image, NetInfo, StatusBar } from 'react-native';

import moment from 'moment';

import connection from 'containers/connection';
import users from 'containers/users';
import Loader from 'components/loader';
import { colors } from 'shared/styles';
import * as Animatable from 'react-native-animatable';

@users
@connection
class Welcome extends Component {
  componentWillMount() {
    const { setConnection } = this.props;
    const dispatchConnected = isConnected => {
      setConnection(isConnected);
      this._loadData();
    };

    setTimeout(async () => {
      const connected = await NetInfo.getConnectionInfo();
      setConnection((connected !== 'none') && (connected !== 'unknown'));
      this._loadData();
      NetInfo.isConnected.addEventListener('connectionChange', dispatchConnected);
    }, 0);
  }

  _loadData = async () => {
    const { navigation: { navigate }, getCurrentUser, getCurrentUserOffline, deleteCurrentUser } = this.props;

  //   try {
  //     if (this.props.isConnected) {
  //       const user = await getCurrentUser();
  //       const now = moment();
  //       const paymentDate = moment(user.nextPaymentDate);
  //       const diffDays = paymentDate.diff(now, 'days');

  //       if (user !== null) {
  //         if (diffDays >= 0) {
  //           navigate('SearchCourses');
  //         } else {
  //           navigate('ActivateAccount');
  //         }
  //       } else {
  //         deleteCurrentUser();
  //       }
  //     } else {
  //       const user = await getCurrentUserOffline();
  //       if (user !== null) navigate('SearchCourses');
  //     }
  //   } catch (err) {
  //     navigate('Intro');
  //   }

    navigate('Intro');
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.brightBlue }}>
        <StatusBar backgroundColor={colors.brightBlue} barStyle="light-content" />
        <Image resizeMode="contain" source={require('../assets/things.png')} style={{ position: 'absolute', top: 0, left: 0 }} />
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ height: 150, width: 200, elevation: 15 }}>
            <Animatable.Image animation="fadeIn" duration={3500} resizeMode="contain" source={require('../assets/logo-lshw.png')} style={{ height: 150, width: 200 }} />
          </View>
        </View>
        <Loader />
      </View>
    );
  }
}

export default Welcome;
