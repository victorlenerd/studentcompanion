import React, { Component } from 'react';
import {
  View,
  ActionSheetIOS,
  Platform,
  Alert,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
  BackHandler
} from 'react-native';

import { CameraKitCamera, CameraKitGalleryView, CameraKitGallery } from 'react-native-camera-kit';
import { main, colors } from 'shared/styles';
import EmptyState from 'components/emptyState';
import connection from 'containers/connection';
import Loader from 'components/loader';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

@connection
class TextExtractor extends Component {
  state = {
    ready: false,
    cameraLight: 'auto',
    image: null,
    extractedNotes: [],
    useCamera: null,
    selectedPhotos: [],
    modalVisible: false,
    docType: null
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
  }

  add = () => {
    if (Platform.OS !== 'ios') {
      Alert.alert(
        'Type Of Document',
        'What Type Of Document Do You Want To Snap ?',
        [
          { text: 'Typed', onPress: () => this.setState({ docType: 0 }, () => this.choosePhotoOption()) },
          { text: 'Hand Written', onPress: () => this.setState({ docType: 1 }, () => this.choosePhotoOption()) },
          { text: 'Canel', style: 'cancel', onPress: () => {} }
        ], { cancelable: false });
    } else {
      ActionSheetIOS.showActionSheetWithOptions({
        title: 'Type Of Document',
        message: 'What Type Of Document Do You Want To Snap ?',
        options: ['Typed', 'Hand Written', 'Canel'],
        cancelButtonIndex: 2
      }, index => {
        if (index !== 2) {
          return this.setState({ docType: index }, () => this.choosePhotoOption());
        }
      });
    }
  }

  choosePhotoOption = () => {
    if (Platform.OS !== 'ios') {
      Alert.alert(
        'Photo Upload', 'Choose where to get photos.',
        [
          { text: 'Gallery', onPress: () => this.setState({ useCamera: 0, modalVisible: true }) },
          { text: 'Camera', onPress: () => this.setState({ useCamera: 1, modalVisible: true }) },
          { text: 'Cancel', style: 'cancel', onPress: () => {} },
        ], { cancelable: false });
    } else {
      ActionSheetIOS.showActionSheetWithOptions({
        title: 'Photo Upload',
        message: 'Where to get photo?',
        options: ['Open Gallery', 'Open Camera', 'Cancel'],
        cancelButtonIndex: 2
      }, index => {
        if (index !== 2) {
          return this.setState({ useCamera: index, modalVisible: true });
        }
      });
    }
  }

  snap = async () => {
    const image = await this.camera.capture(true);
    this.setState({ ready: true, image });
  }

  cancel = () => {
    this.setState({
      docType: null,
      useCamera: null,
      selectedPhotos: [],
      modalVisible: false
    });
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

  renderFlashLightIcon = () => {
    if (this.state.cameraLight === 'auto') {
      return (
        <Image style={styles.actionSmallIcon} source={require('../assets/automatic-flash.png')} resizeMode="contain" />
      );
    }

    if (this.state.cameraLight === 'off') {
      return (
        <Image style={styles.actionSmallIcon} source={require('../assets/flash-off.png')} resizeMode="contain" />
      );
    }

    if (this.state.cameraLight === 'on') {
      return (
        <Image style={styles.actionSmallIcon} source={require('../assets/flash.png')} resizeMode="contain" />
      );
    }

    return null;
  }

  renderSelected = () => {
    return (
      <View style={{ flex: 1 }}>
        {this.state.ready && this.state.useCamera === 1 &&
        <Image style={{ flex: 1, backgroundColor: colors.brightBlue }} resizeMode="contain" source={{ uri: this.state.image.uri }} />}
        {this.state.ready && this.state.useCamera === 0 &&
        <Swiper loop={false} loadMinimal={true} containerStyle={{ flex: 1 }}>
          {this.state.selectedPhotos.map((img, i) => {
            return (
              <View key={() => i} style={{ flex: 1 }}>
                <Image
                  source={{ uri: img.uri, cache: true }}
                  resizeMode="center"
                  style={{ flex: 1 }}
                />
              </View>
            );
          })}
        </Swiper>}
        <View style={styles.controlSpaces}>
          <TouchableOpacity onPress={e => { this.setState({ ready: false }); }} style={[styles.actionBtn, { }]}>
            <Image style={styles.actionIcon} source={require('../assets/cross.png')} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={e => {
              this.props.navigation.navigate('Reader', {
                images: this.state.useCamera === 1 ? [this.state.image] : this.state.selectedPhotos,
                type: this.state.docType
              });
            }}
            style={[styles.actionBtn, {}]}
          >
            <Image style={styles.actionIcon} source={require('../assets/mark.png')} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderControls = () => {
    return (
      <View style={styles.controlSpaces}>
        <TouchableOpacity style={[styles.otherButton]} onPress={this.cancel}>
          <Text style={{ fontSize: 18, color: '#FFC221' }}>CANCEL</Text>
        </TouchableOpacity>
        {this.state.useCamera === 1 &&
        <TouchableOpacity onPress={this.snap} style={[styles.talkButton]}>
          <View style={styles.innerCircle} />
        </TouchableOpacity>}
        {this.state.useCamera === 1 &&
        <TouchableOpacity style={[styles.otherButton]} onPress={this.changeFlashLight}>
          {this.renderFlashLightIcon()}
        </TouchableOpacity>}
        {this.state.useCamera === 0 &&
        <TouchableOpacity
          style={[styles.otherButton]}
          onPress={async () => {
            try {
              const { images } = await CameraKitGallery.getImagesForIds(this.state.selectedPhotos);
              this.setState({
                ready: true,
                selectedPhotos: images
              });
            } catch (err) {
              throw err;
            }
          }}
        >
          <Text style={{ fontSize: 18, color: '#FFC221' }}>DONE</Text>
        </TouchableOpacity>}
      </View>
    );
  }

  renderModal = () => {
    const { useCamera, modalVisible } = this.state;
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
            style={{
              flex: 1,
              backgroundColor: '#000000'
            }}
            cameraOptions={{
              flashMode: 'auto',
              focusMode: 'on',
              zoomMode: 'on',
              ratioOverlayColor: colors.brightBlue
            }}
          />}
          {useCamera === 0 && <CameraKitGalleryView
            ref={gallery => this.gallery = gallery}
            style={{ flex: 1, marginTop: 20, marginHorizontal: 20 }}
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
          {this.renderControls()}
        </View>}
        <Loader />
      </Modal>
    );
  };

  renderSection() {
    if (this.state.extractedNotes.length > 0) {
      return (
        <ScrollView style={{ flex: 1 }}>
          {this.state.extractedNotes.map((photoNote, index) => {
            return (<View />);
          })}
          <View style={{ height: 200 }} />
        </ScrollView>
      );
    }

    return (<EmptyState message="You have not extrated text from any photos." />);
  }

  renderOfflineBanner() {
    if (!this.props.isConnected) {
      return (
        <View style={{ width, height: 80, paddingLeft: 20, justifyContent: 'center', backgroundColor: colors.red }}>
          <Text style={{ color: colors.white, fontSize: 22, fontWeight: '300' }}>You are offline!</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={main.container}>
        {this.renderOfflineBanner()}
        {this.renderModal()}
        {this.renderSection()}
        <View style={[main.fabHome, { width }]}>
          <TouchableOpacity
            onPress={this.add}
            style={main.Fab}
          >
            <Image source={require('../assets/add_white.png')} style={main.fabIcon} />
          </TouchableOpacity>
        </View>
        <Loader />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.lightBlue,
    borderTopColor: colors.accent,
    borderTopWidth: 2
  },
  camSpace: {
    flex: 1
  },
  talkButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFC221',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherButton: {
    width: 80,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  talkText: {
    color: '#ffffff',
    fontSize: 20
  },
  innerCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: colors.accent
  },
  controlSpaces: {
    width,
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: colors.brightBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  actionBtn: {
    flex: 0.5,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionIcon: {
    width: 18,
    height: 18
  },

  actionSmallIcon: {
    width: 22,
    height: 22
  }
});

export default TextExtractor;
