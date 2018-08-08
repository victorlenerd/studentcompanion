import React, { Component } from 'react';
import { View, ScrollView, Text, Image, StatusBar, TouchableOpacity, Dimensions, StyleSheet, BackHandler } from 'react-native';
import { colors } from 'shared/styles';
import Tracking from 'shared/tracking';

import drawerIcon from 'containers/drawerIcon';

const { width, height } = Dimensions.get('window');

@drawerIcon
class Home extends Component {
  componentWillMount() {
    Tracking.setCurrentScreen('Page_Home');

    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

    this.props.setMenu(true, null);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
  }

  render() {
    const { navigation: { navigate } } = this.props;
    return (
      <View style={style.container}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <ScrollView>
          <TouchableOpacity
            onPress={() => { navigate('SearchTyped'); }}
            style={style.homeMenu}
          >
            <Image
              resizeMode="contain"
              source={require('../assets/search-accent.png')}
              style={style.homeIcon}
            />
            <View style={{ marginLeft: 20 }}>
              <Text style={style.homeTitle}>Search</Text>
              <Text style={style.homeSubtitle}>
                Search resources by topic or titles.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { navigate('TextExtractor'); }}
            style={style.homeMenu}
          >
            <Image
              resizeMode="contain"
              source={require('../assets/eye-accent.png')}
              style={style.homeIcon}
            />
            <View style={{ marginLeft: 20 }}>
              <Text style={style.homeTitle}>Extract Text</Text>
              <Text style={style.homeSubtitle}>
                Extract Text From Notes and Documents.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { navigate('SavedCourses'); }}
            style={style.homeMenu}
          >
            <Image
              resizeMode="contain"
              source={require('../assets/books-accent.png')}
              style={style.homeIcon}
            />
            <View style={{ marginLeft: 20 }}>
              <Text style={style.homeTitle}>Library</Text>
              <Text style={style.homeSubtitle}>
                Offline resources available on your phone.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { navigate('Feedback'); }}
            style={style.homeMenu}
          >
            <Image
              resizeMode="contain"
              source={require('../assets/bubble-orange.png')}
              style={style.homeIcon}
            />
            <View style={{ marginLeft: 20 }}>
              <Text style={style.homeTitle}>Feedback</Text>
              <Text style={style.homeSubtitle}>
                We would love to hear from you.
              </Text>
            </View>
          </TouchableOpacity>

        </ScrollView>
      </View>
    );
  }
}

const style = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  container: {
    width,
    height,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.lightBlue,
    borderTopColor: colors.accent,
    borderTopWidth: 2,
  },
  homeMenu: {
    flex: 1,
    height: 100,
    borderBottomWidth: 2,
    paddingHorizontal: 20,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  homeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  homeIcon: {
    width: 26,
    height: 26
  },
  homeSubtitle: {
    fontSize: 16,
    fontWeight: '200',
    color: colors.black,
    marginTop: 10,
    paddingRight: 10
  }
});

export default Home;
