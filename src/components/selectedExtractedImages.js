import React, { Component } from 'react';
import {
  Image,
  View,
  Modal
} from 'react-native';
import PropTypes from 'prop-types';

import Swiper from 'react-native-swiper';
import { colors } from 'shared/styles';
import TextExtractorControls from 'components/textExtractorControls';

class SelectedExtractedImages extends Component {
  render() {
    const { useCamera, images, declineImages, approveImages, modalVisible } = this.props;

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {}}
      >
        <View style={{ flex: 1 }}>
          {useCamera === 1 &&
          <Image style={{ flex: 1, backgroundColor: colors.brightBlue }} resizeMode="contain" source={{ uri: images[0].uri }} />}
          {useCamera === 0 &&
          <Swiper loop={false} loadMinimal={true} containerStyle={{ flex: 1 }}>
            {images.map((img, i) => {
            return (
              <View key={img.uri} style={{ flex: 1 }}>
                <Image
                  source={{ uri: img.uri, cache: true }}
                  resizeMode="center"
                  style={{ flex: 1 }}
                />
              </View>
            );
          })}
          </Swiper>}
          <TextExtractorControls uploadStage={true} done={approveImages} cancel={declineImages} />
        </View>
      </Modal>
    );
  }
}

SelectedExtractedImages.propTypes = {
  useCamera: PropTypes.number,
  images: PropTypes.array,
  modalVisible: PropTypes.bool,
  declineImages: PropTypes.func,
  approveImages: PropTypes.func
};

export default SelectedExtractedImages;
