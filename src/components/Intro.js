import React, { Component } from 'react';

import { View, Text, Image, AsyncStorage, ActivityIndicator, Alert } from 'react-native';

import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';

import { navigator } from '../shared/Navigation';
import { intro, main, colors } from '../shared/styles';

import { Button, ButtonInActive } from './Buttons';

import Swiper from 'react-native-swiper';

class Intro extends Component {
  done = () => {
    navigator.signUp();
  };

  componentDidMount() {
    setTimeout(this.bookImage.zoomIn, 1000);
  }

  onSlideChangeHandle = (index, total) => {
    if (index == 0) {
      this.bookImage.zoomIn();
    }

    if (index == 1) {
      this.headPhoneImage.bounceIn();
    }

    if (index == 2) {
      this.pasteImage.flipInX();
    }

    if (index == 3) {
      this.notesImage.tada();
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
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
              <Text style={[intro.info, { fontSize: 60 }]}>What Are You Waiting For?</Text>
              <Button text="Get Started" onPress={this.done} />
            </View>
          </View>
        </Swiper>
      </View>
    );
  }
}

let mapStateToProps = store => {
  return {
    isLoading: store.requestState.status,
  };
};

export default connect(mapStateToProps)(Intro);
