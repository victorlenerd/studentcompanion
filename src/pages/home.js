import React, { Component } from 'react';
import { View, Text, Image, StatusBar, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { colors } from 'shared/styles';

const { width, height } = Dimensions.get('window');

class Home extends Component {
  render() {
    const { navigation: { navigate } } = this.props;
    return (
      <View style={style.container}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <View style={style.row}>
          <TouchableOpacity
            onPress={() => {
              navigate('Search');
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
              Find study resources by school or subject.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigate('UploadPhotos');
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
              source={require('../assets/file-picture-accent.png')}
              style={style.homeIcon}
            />
            <Text style={style.homeTitle}>Upload Photos</Text>
            <Text style={style.homeSubtitle}>
              Earn from uploading photos of your notes.
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
              source={require('../assets/open-book-black-accent.png')}
              style={style.homeIcon}
            />
            <Text style={style.homeTitle}>Library</Text>
            <Text style={style.homeSubtitle}>
              Find resources you have saved on you phone.
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
    flex: 0.5,
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
    fontSize: 18,
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
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 10
  }
});

export default Home;
