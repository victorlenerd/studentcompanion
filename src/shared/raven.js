import Raven from 'raven-js';
import DeviceInfo from 'react-native-device-info';

export const initRaven = () => {
  require('raven-js/plugins/react-native')(Raven);
  Raven.config('https://9e797031066c4273b92979295f8314c8:d7f2e72e134b4be692ccbd7cea570d5b@sentry.io/278658', {
    release: DeviceInfo.getVersion()
  }).install();
};

export default Raven;
