import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Modal, View } from 'react-native';

import {
  CameraKitCamera,
  CameraKitGallery,
  CameraKitGalleryView
} from 'react-native-camera-kit';

import { colors } from 'shared/styles';

import TextExtractorControls from 'components/textExtractorControls';
import Loader from 'components/loader';

class CameraGallery extends Component {
  state = {
    selectedPhotos: [],
    cameraLight: 'auto'
  }

  async componentDidMount() {
    const isCameraAuthorized = await CameraKitCamera.checkDeviceCameraAuthorizationStatus();
    console.log(isCameraAuthorized, 'isCameraAuthorized');
    if (!isCameraAuthorized) {
      // this.requestCameraPermission();
    }
  }


  changeFlashLight = async () => {
    try {
      if (this.state.cameraLight === 'auto') {
        await this.camera.setFlashMode('on');
        this.setState({ cameraLight: 'on' });
        return;
      }

      if (this.state.cameraLight === 'on') {
        await this.camera.setFlashMode('off');
        this.setState({ cameraLight: 'off' });
        return;
      }

      if (this.state.cameraLight === 'off') {
        await this.camera.setFlashMode('auto');
        this.setState({ cameraLight: 'auto' });
      }
    } catch (err) {
      // Do nothing
    }
  }

  done = async () => {
    const { useCamera, done } = this.props;

    if (useCamera === 1) {
      const image = await this.camera.capture(true);
      return done([image]);
    }

    const { images } = await CameraKitGallery.getImagesForIds(this.state.selectedPhotos);
    return done(images);
  }

  render() {
    const { useCamera, modalVisible, cancel } = this.props;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {}}
      >
        {this.state.ready && this.renderSelected()}
        {!this.state.ready &&
        <View style={styles.camSpace}>
          {useCamera === 1 && <CameraKitCamera
            ref={cam => this.camera = cam}
            style={styles.camera}
            cameraOptions={{
              flashMode: 'auto',
              focusMode: 'on',
              zoomMode: 'on',
              ratioOverlayColor: colors.brightBlue
            }}
          />}
          {useCamera === 0 && <CameraKitGalleryView
            ref={gallery => this.gallery = gallery}
            style={styles.gallery}
            minimumInteritemSpacing={10}
            minimumLineSpacing={10}
            columnCount={3}
            onTapImage={event => {
              const { nativeEvent: { selected } } = event;
              if (this.state.selectedPhotos.indexOf(selected) !== -1) {
                return this.setState({
                  selectedPhotos: this.state.selectedPhotos.filter(f => f !== selected)
                });
              }

              return this.setState({
                selectedPhotos: this.state.selectedPhotos.concat(selected)
              });
            }}
          />}
          <TextExtractorControls
            cameraLight={this.state.cameraLight}
            changeFlashLight={this.changeFlashLight}
            useCamera={useCamera}
            done={this.done}
            cancel={cancel}
          />
        </View>}
        <Loader />
      </Modal>
    );
  }
}

CameraGallery.propTypes = {
  useCamera: PropTypes.number,
  done: PropTypes.func,
  cancel: PropTypes.func,
  modalVisible: PropTypes.bool
};

const styles = StyleSheet.create({
  camSpace: {
    flex: 1
  },
  camera: {
    flex: 1,
    backgroundColor: '#000000'
  },
  gallery: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 20
  }
});

export default CameraGallery;
