import { StackNavigator, DrawerNavigator, TabNavigator } from 'react-navigation';

import WelcomeScreen from 'pages/welcome';
import IntroScreen from 'pages/intro';
import PassScreen from 'pages/pass';
import SignUp from 'pages/signUp';
import SignIn from 'pages/signIn';
import ForgotPassword from 'pages/forgotPassword';
// import SearchCourses from 'pages/searchCourses';
// import Course from 'pages/course';

const NormalScreen = Screen => ({
  screen: Screen,
  navigationOptions: {
    header: null
  }
});

// const SearchCoursesNavigator = DrawerNavigator({
//   Search: {
//     screen: SearchCourses
//   }
// });

// const CourseNavigator = TabNavigator({
//   Course: {
//     screen: Course
//   }
// });

const Navigation = StackNavigator({
  Welcome: NormalScreen(WelcomeScreen),
  Intro: NormalScreen(IntroScreen),
  Pass: NormalScreen(PassScreen),
  SignUp: NormalScreen(SignUp),
  SignIn: NormalScreen(SignIn),
  ForgotPassword: NormalScreen(ForgotPassword),
  // SearchCourses: {
  //   screen: SearchCoursesNavigator
  // },
  // Course: {
  //   screen: CourseNavigator
  // }
});

export default Navigation;
// import { colors } from './styles';

// import Welcome from '../components/Welcome';
// import Intro from '../components/Intro';
// import Pass from '../components/Pass';
// import SignUp from '../components/SignUp';
// import SignIn from '../components/SignIn';
// import SignOut from '../components/SignOut';
// import ForgotPassword from '../components/ForgotPassword';
// import Home from '../components/Home';
// import SearchCourses from '../components/SearchCourses';
// import ChooseFaculty from '../components/ChooseFaculty';
// import ChooseDepartment from '../components/ChooseDepartment';
// import ChooseLevel from '../components/ChooseLevel';
// import ChooseCourses from '../components/ChooseCourses';
// import CourseContainer from '../components/Course';
// import AcademicInfo from '../components/AcademicInfo';
// import SavedCoursesContainer from '../components/SavedCourses';
// import Questions from '../components/Questions';
// import Note from '../components/Note';
// import Payment from '../components/Payment';
// import Practice from '../components/Practice';
// import PhotoNotes from '../components/PhotoNotes';
// import StudyTime from '../components/StudyTime';
// import ReminderModal from '../components/ReminderModal';
// import Feedback from '../components/Feedback';
// import Comments from '../components/Comments';
// import Summarized from '../components/Summarized';
// import ActivateAccount from '../components/ActivateAccount';
// import ActivateMultipleDevice from '../components/ActivateMultipleDevice';
// import Drawer from '../components/Drawer';

// import { Provider } from 'react-redux';
// import store from './store.js';

// export const registerComponents = () => {
//   Navigation.registerComponent('UPQ.Welcome', () => Welcome, store, Provider);
//   Navigation.registerComponent('UPQ.Intro', () => Intro, store, Provider);
//   Navigation.registerComponent('UPQ.SignIn', () => SignIn, store, Provider);
//   Navigation.registerComponent('UPQ.SignUp', () => SignUp, store, Provider);
//   Navigation.registerComponent('UPQ.SignOut', () => SignOut, store, Provider);
//   Navigation.registerComponent('UPQ.ForgotPassword', () => ForgotPassword, store, Provider);
//   Navigation.registerComponent('UPQ.Practice', () => Practice, store, Provider);
//   Navigation.registerComponent('UPQ.Home', () => Home, store, Provider);
//   Navigation.registerComponent('UPQ.SearchCourses', () => SearchCourses, store, Provider);
//   Navigation.registerComponent('UPQ.ChooseFaculty', () => ChooseFaculty, store, Provider);
//   Navigation.registerComponent('UPQ.ChooseDepartment', () => ChooseDepartment, store, Provider);
//   Navigation.registerComponent('UPQ.ChooseLevel', () => ChooseLevel, store, Provider);
//   Navigation.registerComponent('UPQ.ChooseCourses', () => ChooseCourses, store, Provider);
//   Navigation.registerComponent('UPQ.SavedCourses', () => SavedCoursesContainer, store, Provider);
//   Navigation.registerComponent('UPQ.Course', () => CourseContainer, store, Provider);
//   Navigation.registerComponent('UPQ.Questions', () => Questions, store, Provider);
//   Navigation.registerComponent('UPQ.Note', () => Note, store, Provider);
//   Navigation.registerComponent('UPQ.StudyTime', () => StudyTime, store, Provider);
//   Navigation.registerComponent('UPQ.ReminderModal', () => ReminderModal, store, Provider);
//   Navigation.registerComponent('UPQ.Feedback', () => Feedback, store, Provider);
//   Navigation.registerComponent('UPQ.Summarized', () => Summarized, store, Provider);
//   Navigation.registerComponent('UPQ.Comments', () => Comments, store, Provider);
//   Navigation.registerComponent('UPQ.AcademicInfo', () => AcademicInfo, store, Provider);
//   Navigation.registerComponent('UPQ.ActivateAccount', () => ActivateAccount, store, Provider);
//   Navigation.registerComponent('UPQ.ActivateDevice', () => ActivateMultipleDevice, store, Provider);
//   Navigation.registerComponent('UPQ.ActivateDevicePass', () => Pass, store, Provider);
//   Navigation.registerComponent('UPQ.Pass', () => Pass, store, Provider);
//   Navigation.registerComponent('UPQ.PhotoNotes', () => PhotoNotes, store, Provider);
//   Navigation.registerComponent('UPQ.Payment', () => Payment, store, Provider);
//   Navigation.registerComponent('UPQ.Drawer', () => Drawer, store, Provider);
// };

// let navigatorButton;

// if (Platform.OS === 'ios') {
//   navigatorButtons = {
//     leftButtons: [
//       {
//         id: 'menu',
//         title: 'Menu',
//         buttonFontSize: 14,
//         icon: require('../assets/menu.png'),
//       },
//     ],
//   };
// } else {
//   navigatorButtons = {
//     leftButtons: [
//       {
//         id: 'sideMenu',
//         title: 'Menu',
//       },
//     ],
//   };
// }

// export const navigator = {
//   welcome: () => {
//     Navigation.startSingleScreenApp({
//       screen: {
//         screen: 'UPQ.Welcome',
//         navigatorStyle: {
//           navBarHidden: true,
//         },
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//     });
//   },
//   intro: props => {
//     Navigation.startSingleScreenApp({
//       screen: {
//         screen: 'UPQ.Intro',
//         title: 'My Patients',
//         navigatorStyle: {
//           navBarHidden: true,
//         },
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       passProps: props,
//     });
//   },
//   signIn: props => {
//     props.navigator.push({
//       screen: 'UPQ.SignIn',
//       title: '',
//       navigatorStyle: {
//         navBarHidden: true,
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//     });
//   },
//   signUp: () => {
//     Navigation.startSingleScreenApp({
//       screen: {
//         screen: 'UPQ.SignUp',
//         navigatorStyle: {
//           navBarHidden: true,
//         },
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//     });
//   },
//   signout: props => {
//     props.navigator.push({
//       screen: 'UPQ.SignOut',
//       navigatorStyle: {
//         navBarHidden: true,
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       passProps: props,
//     });
//   },
//   forgotPassword: props => {
//     props.navigator.push({
//       screen: 'UPQ.ForgotPassword',
//       title: 'Forgot Password',
//       navigatorStyle: {
//         navBarButtonColor: colors.black,
//         navBarBackgroundColor: colors.lightBlue,
//         navBarTextColor: colors.black,
//         statusBarHidden: true,
//         navBarNoBorder: true,
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       passProps: props,
//     });
//   },
//   home: props => {
//     Navigation.startSingleScreenApp({
//       screen: {
//         screen: 'UPQ.Home',
//         title: 'Home',
//         navigatorStyle: {
//           navBarButtonColor: colors.white,
//           navBarBackgroundColor: colors.primary,
//           navBarTextColor: colors.white,
//           statusBarColor: '#00384D',
//         },
//         navigatorButtons,
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       drawer: {
//         left: {
//           screen: 'UPQ.Drawer',
//         },
//       },
//     });
//   },
//   searchCourses: options => {
//     Navigation.startSingleScreenApp({
//       screen: {
//         screen: 'UPQ.SearchCourses',
//         title: 'Search Courses',
//         navigatorStyle: {
//           navBarButtonColor: colors.white,
//           navBarBackgroundColor: colors.primary,
//           navBarTextColor: colors.white,
//           statusBarColor: '#00384D',
//         },
//         navigatorButtons,
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       drawer: {
//         left: {
//           screen: 'UPQ.Drawer',
//         },
//       },
//       passProps: options || {},
//     });
//   },
//   savedCourses: options => {
//     Navigation.startSingleScreenApp({
//       screen: {
//         screen: 'UPQ.SavedCourses',
//         title: 'My Courses',
//         navigatorStyle: {
//           navBarButtonColor: colors.white,
//           navBarBackgroundColor: colors.primary,
//           navBarTextColor: colors.white,
//           statusBarColor: '#00384D',
//         },
//         navigatorButtons,
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       drawer: {
//         left: {
//           screen: 'UPQ.Drawer',
//         },
//       },
//       passProps: options || {},
//     });
//   },
//   course: title => {
//     Navigation.startSingleScreenApp({
//       screen: {
//         screen: 'UPQ.Course',
//         title: title,
//         navigatorStyle: {
//           navBarButtonColor: colors.white,
//           navBarBackgroundColor: colors.primary,
//           navBarTextColor: colors.white,
//           statusBarColor: '#00384D',
//         },
//         navigatorButtons,
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       drawer: {
//         left: {
//           screen: 'UPQ.Drawer',
//         },
//       },
//     });
//   },
//   photoNotes: props => {
//     Navigation.startSingleScreenApp({
//       screen: {
//         screen: 'UPQ.PhotoNotes',
//         title: 'Upload Photo',
//         navigatorStyle: {
//           navBarButtonColor: colors.white,
//           navBarBackgroundColor: colors.primary,
//           navBarTextColor: colors.white,
//           statusBarColor: '#00384D',
//         },
//         navigatorButtons,
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       drawer: {
//         left: {
//           screen: 'UPQ.Drawer',
//         },
//       },
//     });
//   },
//   studyTime: () => {
//     Navigation.startSingleScreenApp({
//       screen: {
//         screen: 'UPQ.StudyTime',
//         title: 'Reminders',
//         navigatorStyle: {
//           navBarButtonColor: colors.white,
//           navBarBackgroundColor: colors.primary,
//           navBarTextColor: colors.white,
//           statusBarColor: '#00384D',
//         },
//         navigatorButtons,
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       drawer: {
//         left: {
//           screen: 'UPQ.Drawer',
//         },
//       },
//     });
//   },
//   feedback: () => {
//     Navigation.startSingleScreenApp({
//       screen: {
//         screen: 'UPQ.Feedback',
//         title: 'Feedback',
//         navigatorStyle: {
//           navBarButtonColor: colors.white,
//           navBarBackgroundColor: colors.primary,
//           navBarTextColor: colors.white,
//           statusBarColor: '#00384D',
//         },
//         navigatorButtons,
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       drawer: {
//         left: {
//           screen: 'UPQ.Drawer',
//         },
//       },
//     });
//   },
//   reminderModal: props => {
//     props.navigator.push({
//       screen: 'UPQ.ReminderModal',
//       title: 'Add Reminder',
//       navigatorStyle: {
//         navBarButtonColor: colors.white,
//         navBarBackgroundColor: colors.primary,
//         navBarTextColor: colors.white,
//       },
//     });
//   },
//   summarised: (props, title, text) => {
//     props.navigator.push({
//       screen: 'UPQ.Summarized',
//       title: 'Summary',
//       navigatorStyle: {
//         navBarButtonColor: colors.white,
//         navBarBackgroundColor: colors.primary,
//         navBarTextColor: colors.white,
//         statusBarColor: '#00384D',
//       },
//       passProps: {
//         title,
//         text,
//       },
//     });
//   },
//   comments: props => {
//     props.navigator.push({
//       screen: 'UPQ.Comments',
//       title: 'Comments',
//       navigatorStyle: {
//         navBarButtonColor: colors.white,
//         navBarBackgroundColor: colors.primary,
//         navBarTextColor: colors.white,
//         statusBarColor: '#00384D',
//       },
//     });
//   },
//   chooseFaculty: (props, options) => {
//     props.navigator.push({
//       screen: 'UPQ.ChooseFaculty',
//       title: 'Faculty',
//       navigatorStyle: {
//         navBarButtonColor: colors.white,
//         navBarBackgroundColor: colors.primary,
//         navBarTextColor: colors.white,
//         statusBarColor: '#00384D',
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       drawer: {
//         left: {
//           screen: 'UPQ.Drawer',
//         },
//       },
//       passProps: options || {},
//     });
//   },
//   chooseDepartment: (props, options) => {
//     props.navigator.push({
//       screen: 'UPQ.ChooseDepartment',
//       title: 'Departments',
//       navigatorStyle: {
//         navBarButtonColor: colors.white,
//         navBarBackgroundColor: colors.primary,
//         navBarTextColor: colors.white,
//         statusBarColor: '#00384D',
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       drawer: {
//         left: {
//           screen: 'UPQ.Drawer',
//         },
//       },
//       passProps: options || {},
//     });
//   },
//   chooseLevel: (props, options) => {
//     props.navigator.push({
//       screen: 'UPQ.ChooseLevel',
//       title: 'Level',
//       navigatorStyle: {
//         navBarButtonColor: colors.white,
//         navBarBackgroundColor: colors.primary,
//         navBarTextColor: colors.white,
//         statusBarColor: '#00384D',
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       drawer: {
//         left: {
//           screen: 'UPQ.Drawer',
//         },
//       },
//       passProps: options || {},
//     });
//   },
//   chooseCourses: (props, options) => {
//     props.navigator.push({
//       screen: 'UPQ.ChooseCourses',
//       title: 'Courses',
//       navigatorStyle: {
//         navBarButtonColor: colors.white,
//         navBarBackgroundColor: colors.primary,
//         navBarTextColor: colors.white,
//         statusBarColor: '#00384D',
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       drawer: {
//         left: {
//           screen: 'UPQ.Drawer',
//         },
//       },
//       passProps: options || {},
//     });
//   },
//   questions: props => {
//     props.navigator.push({
//       screen: 'UPQ.Questions',
//       navigatorStyle: {
//         navBarButtonColor: colors.white,
//         navBarBackgroundColor: colors.primary,
//         navBarTextColor: colors.white,
//         statusBarColor: '#00384D',
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       drawer: {
//         left: {
//           screen: 'UPQ.Drawer',
//         },
//       },
//     });
//   },
//   note: (props, title) => {
//     props.navigator.push({
//       screen: 'UPQ.Note',
//       title,
//       navigatorStyle: {
//         navBarButtonColor: colors.white,
//         navBarBackgroundColor: colors.primary,
//         navBarTextColor: colors.white,
//         statusBarColor: '#00384D',
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       drawer: {
//         left: {
//           screen: 'UPQ.Drawer',
//         },
//       },
//     });
//   },
//   practice: props => {
//     props.navigator.push({
//       screen: 'UPQ.Practice',
//       navigatorStyle: {
//         navBarButtonColor: colors.white,
//         navBarBackgroundColor: colors.primary,
//         navBarTextColor: colors.white,
//         statusBarColor: '#00384D',
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       drawer: {
//         left: {
//           screen: 'UPQ.Drawer',
//         },
//       },
//       passProps: props,
//     });
//   },
//   academicInfo: props => {
//     Navigation.startSingleScreenApp({
//       screen: {
//         screen: 'UPQ.AcademicInfo',
//         navigatorStyle: {
//           navBarHidden: true,
//         },
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       passProps: props,
//     });
//   },
//   activateAccount: props => {
//     Navigation.startSingleScreenApp({
//       screen: {
//         screen: 'UPQ.ActivateAccount',
//         navigatorStyle: {
//           navBarHidden: true,
//         },
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       passProps: props,
//     });
//   },
//   activateDevice: props => {
//     Navigation.startSingleScreenApp({
//       screen: {
//         screen: 'UPQ.ActivateDevice',
//         navigatorStyle: {
//           navBarHidden: true,
//         },
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       passProps: props,
//     });
//   },
//   activateDevicePass: props => {
//     Navigation.startSingleScreenApp({
//       screen: {
//         screen: 'UPQ.ActivateDevicePass',
//         navigatorStyle: {
//           navBarHidden: true,
//         },
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       passProps: props,
//     });
//   },
//   pass: props => {
//     Navigation.startSingleScreenApp({
//       screen: {
//         screen: 'UPQ.Pass',
//         navigatorStyle: {
//           navBarHidden: true,
//         },
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//     });
//   },
//   payment: (props, amount) => {
//     props.navigator.push({
//       screen: 'UPQ.Payment',
//       title: 'Payment',
//       navigatorStyle: {
//         navBarButtonColor: colors.white,
//         navBarBackgroundColor: colors.primary,
//         navBarTextColor: colors.white,
//       },
//       appStyle: {
//         orientation: 'portrait',
//       },
//       passProps: { amount },
//     });
//   },
// };
