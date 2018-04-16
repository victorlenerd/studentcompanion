import { Alert } from 'react-native';

const API_URL = 'https://fcm.googleapis.com/fcm/send';

class FirebaseClient {
  async send(body, type) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=AIzaSyCW2RHrPANno3EynMTAgoa64OlGFnd86Nw'
    });

    try {
      let response = await fetch(API_URL, { method: 'POST', headers, body });
      try {
        response = await response.json();
        if (!response.success) {
          Alert.alert('Failed to send notification, check error log');
        }
      } catch (err) {
        Alert.alert('Failed to send notification, check error log');
      }
    } catch (err) {
      Alert.alert(err && err.message);
    }
  }
}

const firebaseClient = new FirebaseClient();
export default firebaseClient;
