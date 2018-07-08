import React, { Component } from 'react';
import { View, Image, NetInfo, StatusBar } from 'react-native';

import moment from 'moment';

import DeviceInfo from 'react-native-device-info';
import FCM from 'react-native-fcm';
import connection from 'containers/connection';
import users from 'containers/users';
import Loader from 'components/loader';
import { colors } from 'shared/styles';
import * as Animatable from 'react-native-animatable';

import Tracking from 'shared/tracking';

@users
@connection
class Welcome extends Component {
  state = {
    connected: false
  }

  async componentWillMount() {
    Tracking.setCurrentScreen('Page_Welcome');

    const { setConnection } = this.props;
    // const token = await FCM.getFCMToken();
    const { type } = await NetInfo.getConnectionInfo();
    const connected = type !== 'none';
    setConnection(connected);
    this.setState({ connected });
    this._loadData();

    this.timer = setTimeout(() => {
      this.setState({ connected: false });
      setConnection(false);
      this._loadData();
    }, 15000);

    // await FCM.requestPermissions();
    // console.warn('token', token);
  }

  clearListeners() {
    clearTimeout(this.timer);
    NetInfo.isConnected.removeEventListener('connectionChange');
  }

  _loadData = async () => {
    const { navigation: { navigate }, getCurrentUser, getCurrentUserOffline, deleteCurrentUser, setCurrentUser } = this.props;

    try {
      if (this.state.connected) {
        const user = await getCurrentUser();
        if (user !== null) {
          setCurrentUser(user);

          const now = moment();
          const paymentDate = moment(user.nextPaymentDate);
          const diffDays = paymentDate.diff(now, 'days');

          if (user.verified && user.vericationCode) {
            if (diffDays >= 0) {
              // if (!user.universityId || !user.facultyId || !user.departmentId || !user.levelId) {
              //   this.clearListeners();
              //   return navigate('AcademicInfo');
              // }
              if (user.deviceId !== DeviceInfo.getUniqueID()) {
                this.clearListeners();
                return navigate('ActivateMuitiDevice');
              }

              this.clearListeners();
              navigate('Main');
            } else {
              this.clearListeners();
              return navigate('ActivateAccount');
            }
          } else {
            this.clearListeners();
            navigate('ActivateEmail');
          }
        } else {
          deleteCurrentUser();
          this.clearListeners();
          return navigate('SignIn');
        }
      } else {
        const user = await getCurrentUserOffline();
        setCurrentUser(user);

        if (user !== null) {
          this.clearListeners();
          navigate('Main');
        }
      }
    } catch (err) {
      this.clearListeners();
      navigate('Intro');
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.brightBlue }}>
        <StatusBar backgroundColor={colors.brightBlue} barStyle="light-content" />
        <Image resizeMode="contain" source={require('../assets/things.png')} style={{ position: 'absolute', top: 0, left: 0 }} />
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ height: 150, width: 200, elevation: 15 }}>
            <Animatable.Image animation="fadeIn" duration={500} resizeMode="contain" source={require('../assets/logo-lshw.png')} style={{ height: 150, width: 200 }} />
          </View>
        </View>
        <Loader />
      </View>
    );
  }
}

export default Welcome;
