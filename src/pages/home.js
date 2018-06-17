import React, { Component } from 'react';
import { View, Text, Image, StatusBar, TouchableOpacity, Dimensions, StyleSheet, BackHandler } from 'react-native';
import { colors } from 'shared/styles';

const { width, height } = Dimensions.get('window');

class Home extends Component {
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
  }

  render() {
    const { navigation: { navigate } } = this.props;
    return (
      <View style={style.container}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <View style={style.row}>
          <TouchableOpacity
            onPress={() => {
              navigate('SearchTyped');
            }}
            style={{
              flex: 0.4,
              borderWidth: 1,
              borderColor: '#eee',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              resizeMode="contain"
              source={require('../assets/search-accent.png')}
              style={style.homeIcon}
            />
            <Text style={style.homeTitle}>Search</Text>
            <Text style={style.homeSubtitle}>
              Search resources by topic or titles.
            </Text>
          </TouchableOpacity>
        </View>
        <View style={style.row}>
          <TouchableOpacity
            onPress={() => {
              navigate('TextExtractor');
            }}
            style={{
              flex: 0.4,
              borderWidth: 1,
              borderColor: '#eee',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              resizeMode="contain"
              source={require('../assets/eye-accent.png')}
              style={style.homeIcon}
            />
            <Text style={style.homeTitle}>Extract Text</Text>
            <Text style={style.homeSubtitle}>
              Extract Text From Notes and Documents.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigate('Search');
            }}
            style={{
              flex: 0.6,
              borderWidth: 1,
              borderColor: '#eee',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              resizeMode="contain"
              source={require('../assets/stack-accent.png')}
              style={style.homeIcon}
            />
            <Text style={style.homeTitle}>Browse</Text>
            <Text style={style.homeSubtitle}>
              Browse by schools and departments.
            </Text>
          </TouchableOpacity>
        </View>
        <View style={style.row}>
          <TouchableOpacity
            onPress={() => {
              navigate('SavedCourses');
            }}
            style={{
              flex: 0.4,
              borderWidth: 1,
              borderColor: '#eee',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              resizeMode="contain"
              source={require('../assets/books-accent.png')}
              style={style.homeIcon}
            />
            <Text style={style.homeTitle}>Library</Text>
            <Text style={style.homeSubtitle}>
              Offline resources available on your phone.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigate('Feedback');
            }}
            style={{
              flex: 0.6,
              borderWidth: 1,
              borderColor: '#eee',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              resizeMode="contain"
              source={require('../assets/bubble-orange.png')}
              style={style.homeIcon}
            />
            <Text style={style.homeTitle}>Feedback</Text>
            <Text style={style.homeSubtitle}>
              We would love to hear from you.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  row: {
    flex: 0.33,
    flexDirection: 'column'
  },
  container: {
    width,
    height,
    flexDirection: 'row',
    backgroundColor: colors.lightBlue,
    borderTopColor: colors.accent,
    borderTopWidth: 2,
  },
  homeMenu: {},
  homeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
    marginTop: 20
  },
  homeIcon: {
    width: 32,
    height: 32
  },
  homeSubtitle: {
    fontSize: 14,
    fontWeight: '200',
    color: colors.black,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 10
  }
});

export default Home;
