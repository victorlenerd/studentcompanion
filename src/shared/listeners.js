// import { Platform } from 'react-native';
// import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType, NotificationActionType, NotificationActionOption, NotificationCategoryOption } from 'react-native-fcm';

// AsyncStorage.getItem('lastNotification').then(data => {
//   if (data) {
// if notification arrives when app is killed, it should still be logged here
//     console.log('last notification', JSON.parse(data));
//     AsyncStorage.removeItem('lastNotification');
//   }
// });

// AsyncStorage.getItem('lastMessage').then(data => {
//   if (data) {
// if notification arrives when app is killed, it should still be logged here
//     console.log('last message', JSON.parse(data));
//     AsyncStorage.removeItem('lastMessage');
//   }
// });

// these callback will be triggered only when app is foreground or background
// export function registerAppListener(navigation) {
//   FCM.on(FCMEvent.Notification, notif => {
//   });

//   FCM.on(FCMEvent.RefreshToken, token => {
//     console.log('TOKEN (refreshUnsubscribe)', token);
//   });
// }
