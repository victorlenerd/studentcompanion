import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  BackHandler,
  Alert
} from 'react-native';

import { main, colors } from 'shared/styles';

import EmptyState from 'components/emptyState';
import Loader from 'components/loader';
import UploadForm from 'components/uploadForm';
import PhotoSelector from 'components/photoSelector';
import UploadListItem from 'components/uploadListItem';

import connection from 'containers/connection';
import users from 'containers/users';
import photos from 'containers/photos';

const { height, width } = Dimensions.get('window');

@users
@photos
@connection
class UploadPhotos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      userId: '',
      school: '',
      faculty: '',
      department: '',
      level: '',
      semester: '',
      courseName: '',
      courseCode: '',
      uploadState: 0,
      photoNotes: [],
    };
  }

  async componentWillMount() {
    const { isConnected, currentUser: { $id }, getPhotoNotes } = this.props;
    if (isConnected) {
      try {
        this.setState({ userId: $id });
        const results = await getPhotoNotes($id);
        this._setPhotoNotes(results);
      } catch (err) {
        Alert.alert('Err!', err.message, [{ text: 'Cancel', style: 'cancel' }]);
      }

      BackHandler.addEventListener('hardwareBackPress', () => {
        this.props.navigation.goBack();
      });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
  }

  _setPhotoNotes = photoNotes => {
    const cCodes = [];
    const notesPhotos = [];

    photoNotes.forEach(photoNote => {
      if (cCodes.indexOf(photoNote.courseCode) !== -1) return false;
      cCodes.push(photoNote.courseCode);
      notesPhotos.push(photoNote);
    });

    this.setState({ photoNotes: notesPhotos });
  };

  _done = async images => {
    const newPhotoNote = {
      userId: this.state.userId,
      type: this.state.type,
      school: this.state.school,
      faculty: this.state.faculty,
      department: this.state.department,
      level: this.state.level,
      semester: this.state.semester,
      courseName: this.state.courseName,
      courseCode: this.state.courseCode,
      images: images,
      dataAdded: new Date().toISOString(),
    };

    try {
      await this.props.addPhotoNote(newPhotoNote);
      Alert.alert('Successful', 'Your Upload Was Successful', [
        {
          text: 'Ok',
          onPress: () => {
            this._setPhotoNotes(this.state.photoNotes.concat(newPhotoNote));
            this._cancel();
          },
        },
      ]);
    } catch (err) {
      Alert.alert('Err!', err, [{ text: 'Cancel', style: 'cancel' }]);
    }
  };

  _next = data => this.setState({ uploadState: 1, ...data });

  _cancel = () => {
    this.setState({
      modalVisible: false,
      school: '',
      faculty: '',
      department: '',
      level: '',
      courseName: '',
      courseCode: '',
      uploadState: 0,
    });
  };

  _setCurrent = photoNote => {
    this.setState({
      modalVisible: true,
      school: photoNote.school,
      type: photoNote.type,
      faculty: photoNote.faculty,
      department: photoNote.department,
      level: photoNote.level,
      courseName: photoNote.courseName,
      courseCode: photoNote.courseCode,
      uploadState: 1,
    });
  }

  _renderModal = () => {
    const { uploadState } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {}}
      >
        {uploadState === 0 && <UploadForm next={this._next} cancel={this._cancel} />}
        {uploadState === 1 && <PhotoSelector addPhoto={this._addPhoto} done={this._done} cancel={this._cancel} />}
        <Loader />
      </Modal>
    );
  };

  _renderSection() {
    if (this.state.photoNotes.length > 0) {
      return (
        <View style={{ flex: 1 }}>
          {!this.props.isConnected &&
            <View style={{ width, height: 80, paddingLeft: 20, justifyContent: 'center', backgroundColor: colors.red }}>
              <Text style={{ color: colors.white, fontSize: 22, fontWeight: '300' }}>You are offline!</Text>
            </View>
          }
          <ScrollView style={{ flex: 1 }}>
            {this.state.photoNotes.map((photoNote, index) => {
            return (<UploadListItem key={photoNote.$id} photoNote={photoNote} setCurrent={this._setCurrent} />);
          })}
            <View style={{ height: 200 }} />
          </ScrollView>
        </View>
      );
    }

    return (<EmptyState message="You have not uploaded any photos." />);
  }


  render() {
    return (
      <View
        style={{
          width,
          height,
          flexDirection: 'row',
          backgroundColor: colors.lightBlue,
          borderTopColor: colors.accent,
          borderTopWidth: 2,
        }}
      >
        {this._renderModal()}
        {this._renderSection()}
        <View style={[main.fabHome, { width }]}>
          <TouchableOpacity
            onPress={() => {
              if (!this.props.isConnected) {
                return Alert.alert(
                  'Offline',
                  'You cannot upload photos on offline mode!',
                  [
                    { text: 'OK', style: 'cancel', onPress: () => {} }
                  ], { cancelable: false });
              }

              this.setState({
                modalVisible: true,
              });
            }}
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


export default UploadPhotos;
