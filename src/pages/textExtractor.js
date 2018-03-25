import React, { Component } from 'react';
import {
  View,
  ActionSheetIOS,
  Platform,
  Alert,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  BackHandler
} from 'react-native';

import reverse from 'lodash/reverse';

import objToArr from 'shared/objToArr';
import { main, colors } from 'shared/styles';

import connection from 'containers/connection';
import extractedNotes from 'containers/extractedNotes';

import CameraGallery from 'components/cameraGallery';
import SelectedExtractedImages from 'components/selectedExtractedImages';
import ExtractedNoteItem from 'components/extractedNoteItem';
import EmptyState from 'components/emptyState';
import Loader from 'components/loader';

const { width, height } = Dimensions.get('window');

@extractedNotes
@connection
class TextExtractor extends Component {
  state = {
    ready: false,
    extractedNotes: [],
    images: [],
    useCamera: null,
    modalVisible: false,
    docType: null
  }

  async componentWillMount() {
    const { loadNotes } = this.props;
    const ExtractedNotes = await loadNotes();
    this.setState({ extractedNotes: reverse(ExtractedNotes) });

    BackHandler.addEventListener('hardwareBackPress', () => {
      return false;
    });
  }

  componentWillReceiveProps(nextProps) {
    const { extractedNotes: ExtractedNotes } = nextProps;
    this.setState({ extractedNotes: reverse(ExtractedNotes) });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
  }

  add = () => {
    if (!this.props.isConnected) {
      return Alert.alert(
        'Offline',
        'You cannot extract notes on offline mode!',
        [
          { text: 'OK', style: 'cancel', onPress: () => {} }
        ], { cancelable: false });
    }

    if (Platform.OS !== 'ios') {
      Alert.alert(
        'Type Of Document',
        'What Type Of Document Do You Want To Snap ?',
        [
          { text: 'Typed', onPress: () => this.setState({ docType: 0 }, this.choosePhotoOption) },
          { text: 'Hand Written', onPress: () => this.setState({ docType: 1 }, this.choosePhotoOption) },
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
          return this.setState({ docType: index }, this.choosePhotoOption);
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

  done = images => {
    this.setState({ ready: true, images });
  }

  cancel = () => {
    this.setState({
      docType: null,
      useCamera: null,
      ready: false,
      modalVisible: false
    });
  }

  approveImages = () => {
    this.props.navigation.navigate('Reader', {
      images: this.state.images,
      type: this.state.docType,
      isSaved: false
    });
  }

  renderSection() {
    if (this.state.extractedNotes.length > 0) {
      return (
        <View style={{ flex: 1 }}>
          {!this.props.isConnected &&
            <View style={{ width, height: 80, paddingLeft: 20, justifyContent: 'center', backgroundColor: colors.red }}>
              <Text style={{ color: colors.white, fontSize: 22, fontWeight: '300' }}>You are offline!</Text>
            </View>
          }
          <ScrollView style={{ flex: 1 }}>
            {this.state.extractedNotes.map((note, index) => {
            return (
              <ExtractedNoteItem
                key={note.id}
                note={note}
                openItem={() => {
                  this.props.navigation.navigate('Reader', { isSaved: true, note });
              }}
              />
            );
          })}
            <View style={{ height: 200 }} />
          </ScrollView>
        </View>
      );
    }

    return (<EmptyState message="You have not extrated text from any photos." />);
  }

  render() {
    const { useCamera, modalVisible, images, ready } = this.state;

    return (
      <View style={{
        width,
        height,
        flexDirection: 'row',
        backgroundColor: colors.lightBlue,
        borderTopColor: colors.accent,
        borderTopWidth: 2
      }}
      >
        {ready && <SelectedExtractedImages
          images={images}
          useCamera={useCamera}
          modalVisible={modalVisible && ready}
          approveImages={this.approveImages}
          declineImages={this.cancel}
        />}
        {!ready && <CameraGallery
          useCamera={useCamera}
          modalVisible={modalVisible && !ready}
          done={this.done}
          cancel={this.cancel}
        />}
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

export default TextExtractor;
