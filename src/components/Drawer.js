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
  Share,
} from 'react-native';

import MenuItem from 'components/menuItem';
import { main, colors } from 'shared/styles';

import users from 'containers/users';

@users
class Drawer extends Component {
  signout = () => {
    const { signOut, navigation: { navigate } } = this.props;
    Alert.alert('Are you sure you want to sign out?', 'If you sign out you will lose all your saved courses', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          await signOut();
          navigate('Welcome');
        },
      },
    ]);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.lightBlue }}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <View
          style={{
            flex: 0.1,
            padding: 20,
            paddingTop: 30,
            backgroundColor: colors.brightBlue,
            borderBottomColor: colors.accent,
            borderBottomWidth: 2,
          }}
        >
          <Text style={{ fontSize: 20, color: colors.white }}>{this.props.currentUser.name}</Text>
          <Text style={{ fontSize: 15, color: colors.white, marginTop: 5 }}>{this.props.currentUser.email}</Text>
        </View>
        <ScrollView style={{ flex: 0.7, flexDirection: 'column' }}>
          <View style={{ flex: 0.6 }}>
            <MenuItem label="Home" path="Home" navigation={this.props.navigation} />
            <MenuItem label="Search" path="SearchTyped" navigation={this.props.navigation} />
            <MenuItem label="Library" path="SavedCourses" navigation={this.props.navigation} />
            <MenuItem label="Extract Notes" path="TextExtractor" navigation={this.props.navigation} />
            <MenuItem label="Feedback" path="Feedback" navigation={this.props.navigation} />
            <TouchableOpacity
              style={main.nav}
              onPress={() => {
                Share.share({
                  title: 'Share This App',
                  url: 'https://studentcompanion.xyz',
                  message: 'Hey, download the StudentCompanion app. https://studentcompanion.xyz',
                }, {
                  dialogTitle: 'Share This App'
                });
              }}
            >
              <Image source={require('../assets/share2.png')} style={main.nav_image} />
              <Text style={main.nav_item}>Share This App</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={main.nav}
          onPress={this.signout}
        >
          <Image source={require('../assets/switch.png')} style={main.nav_image} />
          <Text style={main.nav_item}>Log Out</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Drawer;
