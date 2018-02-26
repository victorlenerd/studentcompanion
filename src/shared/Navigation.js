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
import ChooseNotesScreen from 'pages/chooseNotes';
import ChoosePapersScreen from 'pages/choosePapers';
import CommentsScreen from 'pages/comments';
import FeedbackScreen from 'pages/feedback';
import SavedCoursesScreen from 'pages/savedCourses';
import UploadPhotosScreen from 'pages/uploadPhotos';
import TextExtractorScreen from 'pages/textExtractor';

import NoteScreen from 'pages/note';
import QuestionsScreen from 'pages/questions';

import Drawer from 'components/drawer';
import NoteToobarOptions from 'components/noteToobarOptions';
import DrawerIcon from 'components/drawerIcon';

import { colors } from 'shared/styles';

const ChooseNotes = StackNavigator({
  Notes: {
    screen: ChooseNotesScreen,
    navigationOptions: {
      header: null
    }
  }
});

const ChoosePapers = StackNavigator({
  Papers: {
    screen: ChoosePapersScreen,
    navigationOptions: {
      header: null
    }
  }
});

const CourseNavigator = TabNavigator({
  ChooseNotes: {
    screen: ChooseNotes,
    navigationOptions: {
      tabBarLabel: 'Notes'
    }
  },
  ChoosePapers: {
    screen: ChoosePapers,
    navigationOptions: {
      tabBarLabel: 'Past Questions'
    }
  }
}, {
  tabBarOptions: {
    tabStyle: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    labelStyle: {
      fontSize: 16
    }
  }
});

const MainNavigator = DrawerNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTitle: 'Home'
    }
  },
  Search: {
    screen: SearchCoursesScreen,
    navigationOptions: {
      headerTitle: 'Search'
    }
  },
  ChooseFaculty: {
    screen: ChooseFacultyScreen,
    navigationOptions: {
      headerTitle: 'Choose Facuty'
    }
  },
  ChooseDepartment: {
    screen: ChooseDepartmentScreen,
    navigationOptions: {
      headerTitle: 'Choose Department'
    }
  },
  ChooseLevel: {
    screen: ChooseLevelScreen,
    navigationOptions: {
      headerTitle: 'Choose Level'
    }
  },
  ChooseCourse: {
    screen: ChooseCourseScreen,
    navigationOptions: {
      headerTitle: 'Choose Courses'
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
      headerTitle: 'Feedback'
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
      headerTitle: 'Upload Photos'
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
      headerTitle: 'Extract Text'
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
      header: null
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
      header: null
    }
  },
  ActivateAccount: {
    screen: ActivateAccountScreen,
    navigationOptions: {
      header: null
    }
  },
  ActivateMuitiDevice: {
    screen: ActivateMuitiDeviceScreen,
    navigationOptions: {
      header: null
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
      header: null
    }
  },
  SignIn: {
    screen: SignInScreen,
    navigationOptions: {
      header: null
    }
  },
  Intro: {
    screen: IntroScreen,
    navigationOptions: {
      header: null
    }
  },
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: {
      header: null
    }
  },
  Course: {
    screen: CourseNavigator
  },
  Main: {
    screen: MainNavigator,
    navigationOptions: ({ navigation }) => ({
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
