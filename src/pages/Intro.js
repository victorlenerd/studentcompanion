import React, { Component } from 'react';

import { View, Text, Image, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Swiper from 'react-native-swiper';

import { intro, colors } from 'shared/styles';
import { Button } from 'components/buttons';

class Intro extends Component {
  componentDidMount() {
    setTimeout(this.bookImage.zoomIn, 1000);
  }

  onSlideChangeHandle = (index, total) => {
    if (index === 0) {
      this.bookImage.zoomIn();
    }

    if (index === 1) {
      this.headPhoneImage.bounceIn();
    }

    if (index === 2) {
      this.pasteImage.flipInX();
    }

    if (index === 3) {
      this.notesImage.tada();
    }
  };

  signUp = () => this.props.navigation.navigate('SignUp');

  signIn = () => this.props.navigation.navigate('SignIn');

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={colors.accent} barStyle="light-content" />
        <Swiper
          containerStyle={{ flex: 1 }}
          loop={false}
          activeDotColor="#fff"
          onIndexChanged={this.onSlideChangeHandle}
        >
          <View style={intro.slide}>
            <View style={intro.slideTop}>
              <Animatable.View ref={r => (this.bookImage = r)}>
                <Image resizeMode="contain" source={require('../assets/open-book.png')} style={intro.image} />
              </Animatable.View>
            </View>
            <View style={intro.slideBottom}>
              <Text style={intro.info}>Find notes for your courses.</Text>
            </View>
          </View>
          <View style={intro.slide}>
            <View style={intro.slideTop}>
              <Animatable.View ref={r => (this.headPhoneImage = r)}>
                <Image resizeMode="contain" source={require('../assets/headphones.png')} style={intro.image} />
              </Animatable.View>
            </View>
            <View style={intro.slideBottom}>
              <Text style={intro.info}>Listen to the audio of your notes.</Text>
            </View>
          </View>
          <View style={intro.slide}>
            <View style={intro.slideTop}>
              <Animatable.View ref={r => (this.pasteImage = r)}>
                <Image resizeMode="contain" source={require('../assets/paste.png')} style={intro.image} />
              </Animatable.View>
            </View>
            <View style={intro.slideBottom}>
              <Text style={intro.info}>Find past questions for courses.</Text>
            </View>
          </View>
          <View style={intro.slide}>
            <View style={intro.slideTop}>
              <Animatable.View ref={r => (this.notesImage = r)}>
                <Image resizeMode="contain" source={require('../assets/notes.png')} style={intro.image} />
              </Animatable.View>
            </View>
            <View style={intro.slideBottom}>
              <Text style={intro.info}>Earn from uploads of notes & P.Qs</Text>
            </View>
          </View>
          <View style={intro.slide}>
            <View style={[intro.slideTop, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
              <Image resizeMode="contain" source={require('../assets/things.png')} style={{ position: 'absolute', top: 0, left: 0 }} />
              <Text style={[intro.info, { fontSize: 28 }]}>Get Started.</Text>
              <Button text="Create A New Account" onPress={this.signUp} />
              <Button text="Login To Existing Account" onPress={this.signIn} />
            </View>
          </View>
        </Swiper>
      </View>
    );
  }
}

export default Intro;
