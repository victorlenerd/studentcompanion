import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';

import { createStackNavigator } from 'react-navigation-stack';


import WelcomeScreen from 'pages/Welcome';
import IntroScreen from 'pages/Intro';
import HomeScreen from 'pages/home';
import PassScreen from 'pages/pass';
import SignUpScreen from 'pages/signUp';
import SignInScreen from 'pages/signIn';
import ForgotPassword from 'pages/forgotPassword';

import ActivateAccountScreen from 'pages/activateAccount';
import ActivateMuitiDeviceScreen from 'pages/activateMultiDevice';
import PaymentScreen from 'pages/payment';
import ChooseCourseScreen from 'pages/chooseCourse';
import CourseHomeScreen from 'pages/courseHome';
import CommentsScreen from 'pages/comments';
import FeedbackScreen from 'pages/feedback';
import SavedCoursesScreen from 'pages/savedCourses';
import UploadPhotosScreen from 'pages/uploadPhotos';
import TextExtractorScreen from 'pages/textExtractor';
import ReaderScreen from 'pages/reader';
import SearchTypedScreen from 'pages/searchTyped';

import ChooseNotesScreen from 'pages/chooseNotes';

import NoteScreen from 'pages/note';

import ActivateEmailScreen from 'pages/activateEmail';
import VerifyEmailScreen from 'pages/verifyEmail';

import Drawer from 'components/Drawer';
import NoteToobarOptions from 'components/noteToobarOptions';
import DrawerIcon from 'components/drawerIcon';

import { colors } from 'shared/styles';

const MainNavigator = createDrawerNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTitle: 'Home',
      gesturesEnabled: false,
    }
  },
  SearchTyped: {
    screen: SearchTypedScreen,
    navigationOptions: ({ navigation }) => ({
      gesturesEnabled: false,
      headerTitle: 'Search',
      headerStyle: {
        backgroundColor: colors.brightBlue,
      },
      headerTitleStyle: {
        color: colors.white
      },
      headerTintColor: '#fff',
      headerLeft: <DrawerIcon navigation={navigation} />,
    })
  },
  ChooseCourse: {
    screen: ChooseCourseScreen,
    gesturesEnabled: false,
    headerTitle: 'Choose Courses',
  },
  CourseHome: {
    screen: CourseHomeScreen,
    headerTitle: 'Choose Home',
    gesturesEnabled: false,
  },
  Feedback: {
    screen: FeedbackScreen,
    navigationOptions: {
      headerTitle: 'Feedback',
      gesturesEnabled: false
    }
  },
  SavedCourses: {
    screen: SavedCoursesScreen,
    navigationOptions: {
      headerTitle: 'Library'
    }
  },
  UploadPhotos: {
    screen: UploadPhotosScreen,
    navigationOptions: {
      headerTitle: 'Upload Photos',
      gesturesEnabled: false
    }
  },
  Comments: {
    screen: CommentsScreen,
    navigationOptions: {
      headerTitle: 'Comments'
    }
  },
  Note: {
    screen: NoteScreen,
    navigationOptions: ({ navigation }) => ({
      headerRight: <NoteToobarOptions navigation={navigation} />
    })
  },
  TextExtractor: {
    screen: TextExtractorScreen,
    navigationOptions: {
      headerTitle: 'Extract Text',
    }
  },
  Reader: {
    screen: ReaderScreen,
    navigationOptions: ({ navigation }) => ({
      headerRight: <NoteToobarOptions extracted={true} navigation={navigation} />,
    })
  },
  Course: {
    screen: ChooseNotesScreen,
    navigationOptions: {
      headerTitle: 'Notes',
    }
  }
}, {
  contentComponent: Drawer,
  drawerType: 'slide',
});


const Navigation = createStackNavigator({
  Welcome: {
    screen: WelcomeScreen,
    navigationOptions: {
      header: null
    }
  },
  Payment: {
    screen: PaymentScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  ActivateAccount: {
    screen: ActivateAccountScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  ActivateEmail: {
    screen: ActivateEmailScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  VerifyEmail: {
    screen: VerifyEmailScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  ActivateMuitiDevice: {
    screen: ActivateMuitiDeviceScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: {
      header: null
    }
  },
  Pass: {
    screen: PassScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  SignIn: {
    screen: SignInScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  Intro: {
    screen: IntroScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  Main: {
    screen: MainNavigator,
    navigationOptions: ({ navigation }) => ({
      gesturesEnabled: false,
      headerStyle: {
        backgroundColor: colors.brightBlue,
      },
      headerTitleStyle: {
        color: colors.white
      },
      headerTintColor: '#fff',
      headerLeft: <DrawerIcon navigation={navigation} />,
    })
  }
});

export default createAppContainer(Navigation);
