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
  BackHandler
} from 'react-native';

import { CameraKitCamera } from 'react-native-camera-kit';
import { main, colors } from 'shared/styles';

const { width } = Dimensions.get('window');

class TextExtractor extends Component {
  state = {
    ready: false,
    cameraLight: 'auto',
    image: null,
    docType: null
  }

  componentWillMount() {
    if (Platform.OS !== 'ios') {
      Alert.alert(
        'Type Of Document',
        'What Type Of Document Do You Want To Snap ?',
        [
          { text: 'Typed', onPress: () => this.setState({ docType: 0 }) },
          { text: 'Hand Written', onPress: () => this.setState({ docType: 1 }) },
          { text: 'Canel', style: 'cancel', onPress: () => this.props.navigation.goBack() }
        ], { cancelable: false });
    } else {
      ActionSheetIOS.showActionSheetWithOptions({
        title: 'Type Of Document',
        message: 'What Type Of Document Do You Want To Snap ?',
        options: ['Typed', 'Hand Written', 'Canel'],
        cancelButtonIndex: 2
      }, index => {
        if (index !== 2) {
          return this.setState({ docType: index });
        }

        this.props.navigation.goBack();
      });
    }

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
  }

  snap = async () => {
    const image = await this.camera.capture(false);
    this.setState({ ready: true, image });
  }

  cancel = () => {
    this.props.navigation.goBack();
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

  renderCamera = () => {
    if (this.state.ready) {
      return (
        <Image style={{ flex: 1, backgroundColor: colors.brightBlue }} resizeMode="contain" source={{ uri: this.state.image.uri }} />
      );
    }

    return (
      <CameraKitCamera
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
      />
    );
  }

  renderControls = () => {
    if (this.state.ready) {
      return (
        <View style={styles.controlSpaces}>
          <TouchableOpacity onPress={e => { this.setState({ ready: false }); }} style={[styles.actionBtn, { }]}>
            <Image style={styles.actionIcon} source={require('../assets/cross.png')} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={e => {
              // navigate('Reader', {
              //     image: this.state.image,
              //     type
              // });
            }}
            style={[styles.actionBtn, {}]}
          >
            <Image style={styles.actionIcon} source={require('../assets/mark.png')} resizeMode="contain" /> 
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.controlSpaces}>
        <TouchableOpacity style={[styles.otherButton]} onPress={this.cancel}>
          <Text style={{ fontSize: 18, color: '#FFC221' }}>CANCEL</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.snap} style={[styles.talkButton]}>
          <View style={styles.innerCircle} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.otherButton]} onPress={this.changeFlashLight}>
          {this.renderFlashLightIcon()}
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    if (this.state.docType === null) return this.state.docType;
    return (
      <View style={main.container}>
        <View style={styles.camSpace}>
          {this.renderCamera()}
          {this.renderControls()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
    height: 100,
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
