import React, { Component } from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import PropTypes from 'prop-types';
import { colors } from 'shared/styles';

const { width } = Dimensions.get('window');

class TextExtactorControls extends Component {
  renderFlashLightIcon = () => {
    const { cameraLight } = this.props;
    if (cameraLight === 'auto') {
      return (
        <Image style={styles.actionSmallIcon} source={require('../assets/automatic-flash.png')} resizeMode="contain" />
      );
    }

    if (cameraLight === 'off') {
      return (
        <Image style={styles.actionSmallIcon} source={require('../assets/flash-off.png')} resizeMode="contain" />
      );
    }

    if (cameraLight === 'on') {
      return (
        <Image style={styles.actionSmallIcon} source={require('../assets/flash.png')} resizeMode="contain" />
      );
    }

    return null;
  }


  render() {
    const { done, cancel, useCamera, changeFlashLight, uploadStage, edittingStage } = this.props;

    return (
      <View style={styles.controlSpaces}>
        <TouchableOpacity style={[styles.otherButton]} onPress={cancel}>
          <Text style={styles.cancelBttn}>CANCEL</Text>
        </TouchableOpacity>
        {useCamera === 1 &&
        <TouchableOpacity onPress={done} style={[styles.talkButton]}>
          <View style={styles.innerCircle} />
        </TouchableOpacity>}
        {useCamera === 1 &&
        <TouchableOpacity style={[styles.otherButton]} onPress={changeFlashLight}>
          {this.renderFlashLightIcon()}
        </TouchableOpacity>}
        {(edittingStage || (useCamera === 0)) &&
        <TouchableOpacity style={[styles.otherButton]} onPress={done}>
          <Text style={styles.doneBttn}>DONE</Text>
        </TouchableOpacity>}
        {uploadStage &&
        <TouchableOpacity style={[styles.otherButton]} onPress={done}>
          <Text style={styles.doneBttn}>UPLOAD</Text>
        </TouchableOpacity>}
      </View>
    );
  }
}

TextExtactorControls.propTypes = {
  done: PropTypes.func,
  cancel: PropTypes.func,
  changeFlashLight: PropTypes.func,
  useCamera: PropTypes.number,
  cameraLight: PropTypes.string,
  uploadStage: PropTypes.bool,
  edittingStage: PropTypes.bool,
};

const styles = StyleSheet.create({
  controlSpaces: {
    width,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: colors.accent
  },
  doneBttn: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white
  },
  cancelBttn: {
    fontSize: 18,
    color: colors.white
  },
  actionSmallIcon: {
    width: 22,
    height: 22
  },
  otherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  talkButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default TextExtactorControls;
