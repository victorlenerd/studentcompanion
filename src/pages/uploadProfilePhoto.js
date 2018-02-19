import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, Dimensions, TouchableOpacity, Alert } from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import { RNS3 } from 'react-native-aws3';

import users from 'containers/users';
import { Button } from 'components/buttons';
import { main, colors } from 'shared/styles';

const { width } = Dimensions.get('window');

@users
class UploadProfilePhoto extends Component {
  openPhotos = async () => {
    try {
      const images = await ImagePicker.openPicker({ multiple: true })
      const options = {
        keyPrefix: 'uploads/',
        bucket: 'studentcompanion',
        region: 'eu-west-2',
        accessKey: 'AKIAJRPZJKWGFMBSQ4LA',
        secretKey: '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',
        successActionStatus: 201
      };

      const genRandom = () => `${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 6)}`;
      const uploadsWrappers = images.map(({ path, mime }) => RNS3.put({ uri: path, name: genRandom(), type: mime }, options));
      await Promise.all(uploadsWrappers);
      Alert.alert('Upload Success', 'Your uploads was successful', [{ text: 'OK', style: 'cancel' }]);
    } catch (err) {
      Alert.alert(err, err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
  }

  render() {
    return (
      <View style={[main.container, { backgroundColor: colors.black }]}>
        <Text style={{ color: colors.white, fontSize: 32, textAlign: 'center', fontWeight: '200', marginVertical: 50 }}>Upload Profile Photo</Text>
        <View style={style.section}>
          <TouchableOpacity onPress={this.openPhotos}>
            <Image style={style.profilePhoto} source={require('../assets/user.png')} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        <View style={[style.section, { marginTop: 80 }]}>
          <Button text="DONE" />
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  profilePhoto: {
    width: 100,
    height: 100,
  },
  section: {
    width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default UploadProfilePhoto;

