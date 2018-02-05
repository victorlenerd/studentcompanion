import React, { Component } from 'react';

import {
  View,
  ScrollView,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions,
  Share,
} from 'react-native';

import { SignOut, GetCurrentUserOffline } from '../ducks/User';
import Tts from 'react-native-tts';

import { main, colors } from '../shared/styles';
import { navigator } from '../shared/Navigation';

import { connect } from 'react-redux';

import { ButtonAccent } from './Buttons';
var { width, height } = Dimensions.get('window');

class Drawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: null,
      name: '',
      email: '',
      phoneNumber: '',
      paid: true,
    };
  }

  go(screen) {
    navigator[screen]();
  }

  signout() {
    Alert.alert('Are you sure you want to sign out?', 'If you sign out you will lose all your saved courses', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: () => {
          this.props.signOut();
        },
      },
    ]);
  }

  componentDidMount() {
    this.props
      .getCurrentUser()
      .then(user => {
        this.setState({
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          paid: user.paid,
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  _renderPaymentButton() {
    if (!this.state.paid) {
      return (
        <View style={{ marginTop: 10 }}>
          <ButtonAccent text="Activate Your Account" />
        </View>
      );
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.lightBlue }}>
        <StatusBar backgroundColor={'#00384D'} barStyle="light-content" />
        <View
          style={{
            flex: 0.3,
            padding: 20,
            paddingTop: 30,
            backgroundColor: colors.primary,
            borderBottomColor: colors.accent,
            borderBottomWidth: 2,
          }}
        >
          <View
            style={{
              height: 50,
              width: 50,
              borderRadius: 15,
              elevation: 5,
              shadowColor: '#000000',
              marginBottom: 15,
              shadowOffset: { width: 2, height: 3 },
              shadowOpacity: 0.3,
            }}
          >
            <Image resizeMode="contain" source={require('../assets/logo.png')} style={{ height: 50, width: 50 }} />
          </View>
          <Text style={{ fontSize: 20, color: colors.white }}>{this.state.name}</Text>
          <Text style={{ fontSize: 15, color: colors.white, marginTop: 5 }}>{this.state.email}</Text>
        </View>
        <ScrollView style={{ flex: 0.5, flexDirection: 'column' }}>
          <View style={{ flex: 0.6 }}>
            <TouchableOpacity
              style={main.nav}
              onPress={() => {
                this.go('home');
              }}
            >
              <Image source={require('../assets/home.png')} style={main.nav_image} />
              <Text style={this.state.current == 0 ? main.nav_item_active : main.nav_item}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={main.nav}
              onPress={() => {
                this.go('searchCourses');
              }}
            >
              <Image source={require('../assets/search.png')} style={main.nav_image} />
              <Text style={this.state.current == 0 ? main.nav_item_active : main.nav_item}>Search Courses</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={main.nav}
              onPress={() => {
                this.go('savedCourses');
              }}
            >
              <Image source={require('../assets/open-book-black.png')} style={main.nav_image} />
              <Text style={this.state.current == 1 ? main.nav_item_active : main.nav_item}>My Courses</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={main.nav}
              onPress={() => {
                this.go('feedback');
              }}
            >
              <Image source={require('../assets/bubble.png')} style={main.nav_image} />
              <Text style={this.state.current == 1 ? main.nav_item_active : main.nav_item}>Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={main.nav}
              onPress={() => {
                this.go('photoNotes');
              }}
            >
              <Image source={require('../assets/file-picture.png')} style={main.nav_image} />
              <Text style={this.state.current == 1 ? main.nav_item_active : main.nav_item}>Upload Photos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={main.nav}
              onPress={() => {
                Share.share({
                  title: 'Share This App With',
                  url:
                    Platform.OS === 'ios'
                      ? 'https://itunes.apple.com/ng/app/student-companion/id1238513973?mt=8'
                      : 'https://play.google.com/store/apps/details?id=com.courseapp',
                  content: `Hey, download the StudentCompanion app.`,
                });
              }}
            >
              <Image source={require('../assets/share2.png')} style={main.nav_image} />
              <Text style={this.state.current == 1 ? main.nav_item_active : main.nav_item}>Share This App</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={main.nav}
          onPress={() => {
            this.signout();
          }}
        >
          <Image source={require('../assets/switch.png')} style={main.nav_image} />
          <Text style={[this.state.current == -1 ? main.nav_item_active : main.nav_item]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCurrentUser: () => {
      return dispatch(GetCurrentUserOffline());
    },
    signOut: () => {
      dispatch(SignOut()).then(
        () => {
          navigator.intro();
        },
        err => {
          Alert.alert('An Error Occured', err.message, [{ text: 'Cancel', style: 'cancel' }]);
        }
      );
    },
  };
};

const mapStateToProps = store => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
