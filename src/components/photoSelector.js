import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, Image, Alert } from 'react-native';
import PropTypes from 'prop-types';

import Swiper from 'react-native-swiper';
import ImagePicker from 'react-native-image-crop-picker';

import { colors } from 'shared/styles';
import EmptyState from 'components/emptyState';
import { Button, ButtonInActive } from 'components/buttons';

const { width } = Dimensions.get('window');

class PhotoSelector extends Component {
  state = {
    images: []
  }

  addPhoto = async () => {
    try {
      const images = await ImagePicker.openPicker({ multiple: true, includeBase64: true });
      this.setState({ images });
    } catch (err) {
      Alert.alert(err, err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
  };

  done = () => {
    if (this.state.images.length > 0) return this.props.done(this.state.images);
    Alert.alert('Err!', 'You need to select some photos', [{ text: 'Cancel', style: 'cancel' }]);
  }

  renderImages = () => {
    if (this.state.images.length > 0) {
      return (
        <Swiper loop={false} loadMinimal={true} containerStyle={{ flex: 1 }}>
          {this.state.images.map((img, i) => {
            if (img.data) {
              return (
                <View key={() => i} style={{ flex: 1 }}>
                  <Image
                    source={{ uri: `data:image/jpg;base64,${img.data}`, cache: true }}
                    resizeMode="center"
                    style={{ flex: 1 }}
                  />
                </View>
              );
            }

            return null;
          })}
        </Swiper>
      );
    }

    return (<EmptyState message="You have not uploaded any photos." />);
  };

  render() {
    return (
      <View style={style.container}>
        <View style={style.top}>
          <Text style={style.title}>{this.state.images.length} Photos</Text>
          <Button text="Add Photo" onPress={this.addPhoto} />
        </View>
        {this.state.images.length > 0 && this.renderImages()}
        {this.state.images.length < 1 && <EmptyState message="You have not selected any image." />}
        <View style={style.bottom}>
          <ButtonInActive text="Cancel" onPress={this.props.cancel} />
          <Button text="Done" onPress={this.done} />
        </View>
      </View>
    );
  }
}

PhotoSelector.propTypes = {
  done: PropTypes.func,
  cancel: PropTypes.func,
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBlue
  },
  title: {
    fontSize: 20, fontWeight: '300'
  },
  top: {
    flexDirection: 'row',
    width,
    marginVertical: 25,
    paddingLeft: 25,
    paddingRight: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottom: {
    width,
    paddingLeft: 25,
    paddingRight: 25,
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});

export default PhotoSelector;
