import React, { Component } from 'react';
import { View, Image, NetInfo, StatusBar } from 'react-native';

import moment from 'moment';

import DeviceInfo from 'react-native-device-info';
import connection from 'containers/connection';
import users from 'containers/users';
import Loader from 'components/loader';
import { colors } from 'shared/styles';
import * as Animatable from 'react-native-animatable';

@users
@connection
class Welcome extends Component {
  state = {
    connected: false
  }

  async componentWillMount() {
    const { setConnection } = this.props;

    const dispatchConnected = isConnected => {
      setConnection(isConnected);
      this.setState({ connected: isConnected });
      this._loadData();
    };

    const { type } = await NetInfo.getConnectionInfo();
    const connected = type !== 'none';
    setConnection(connected);
    this.setState({ connected });
    this._loadData();
    NetInfo.isConnected.addEventListener('connectionChange', dispatchConnected);
  }

  componentWillUnmount() {
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

          if (diffDays >= 0) {
            if (!user.universityId || !user.facultyId || !user.departmentId || !user.levelId) return navigate('AcademicInfo');

            if (user.deviceId !== DeviceInfo.getUniqueID()) return navigate('ActivateMuitiDevice');

            navigate('Main');
          } else {
            return navigate('ActivateAccount');
          }
        } else {
          deleteCurrentUser();
          return navigate('SignIn');
        }
      } else {
        const user = await getCurrentUserOffline();
        setCurrentUser(user);

        if (user !== null) {
          navigate('Main');
        }
      }
    } catch (err) {
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
