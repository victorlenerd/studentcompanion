import React from 'react';
import { StackNavigator, DrawerNavigator, TabNavigator } from 'react-navigation';

import WelcomeScreen from 'pages/welcome';
import IntroScreen from 'pages/intro';
import HomeScreen from 'pages/home';
import PassScreen from 'pages/pass';
import SignUpScreen from 'pages/signUp';
import SignInScreen from 'pages/signIn';
import ForgotPassword from 'pages/forgotPassword';

import AcademicInfoScreen from 'pages/academicInfo';
import ActivateAccountScreen from 'pages/activateAccount';
import ActivateMuitiDeviceScreen from 'pages/activateMultiDevice';
import PaymentScreen from 'pages/payment';
import UploadPhotoScreen from 'pages/uploadProfilePhoto';
import SearchCoursesScreen from 'pages/searchCourses';
import ChooseFacultyScreen from 'pages/chooseFaculty';
import ChooseDepartmentScreen from 'pages/chooseDepartment';
import ChooseLevelScreen from 'pages/chooseLevel';
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
import ChoosePapersScreen from 'pages/choosePapers';

import NoteScreen from 'pages/note';
import QuestionsScreen from 'pages/questions';

import ActivateEmailScreen from 'pages/activateEmail';
import VerifyEmailScreen from 'pages/verifyEmail';

import Drawer from 'components/drawer';
import NoteToobarOptions from 'components/noteToobarOptions';
import DrawerIcon from 'components/drawerIcon';

import { colors } from 'shared/styles';

const MainNavigator = DrawerNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTitle: 'Home',
      gesturesEnabled: false,
    }
  },
  Search: {
    screen: SearchCoursesScreen,
    navigationOptions: {
      headerTitle: 'Browse',
      gesturesEnabled: true,
    }
  },
  SearchTyped: {
    screen: SearchTypedScreen,
    navigationOptions: {
      headerTitle: 'Search',
      gesturesEnabled: false,
    }
  },
  ChooseFaculty: {
    screen: ChooseFacultyScreen,
    navigationOptions: {
      headerTitle: 'Choose Facuty',
      gesturesEnabled: true,
    }
  },
  ChooseDepartment: {
    screen: ChooseDepartmentScreen,
    navigationOptions: {
      headerTitle: 'Choose Department',
      gesturesEnabled: true,
    }
  },
  ChooseLevel: {
    screen: ChooseLevelScreen,
    navigationOptions: {
      headerTitle: 'Choose Level',
      gesturesEnabled: true,
    }
  },
  ChooseCourse: {
    screen: ChooseCourseScreen,
    navigationOptions: {
      headerTitle: 'Choose Courses',
      gesturesEnabled: true,
    }
  },
  CourseHome: {
    screen: CourseHomeScreen,
    navigationOptions: {
      headerTitle: 'Choose Courses'
    }
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
      headerTitle: 'Library',
      gesturesEnabled: false
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
  Questions: {
    screen: QuestionsScreen,
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
  contentComponent: Drawer
});

const Navigation = StackNavigator({
  Welcome: {
    screen: WelcomeScreen,
    navigationOptions: {
      header: null
    }
  },
  AcademicInfo: {
    screen: AcademicInfoScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  UploadPhoto: {
    screen: UploadPhotoScreen,
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

export default Navigation;
