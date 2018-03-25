import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';

import RNFetchBlob from 'react-native-fetch-blob';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import fs from 'react-native-fs';

import { colors, main } from 'shared/styles';
import connection from 'containers/connection';
import extractedNotes from 'containers/extractedNotes';
import reader from 'containers/reader';
import Loader from 'components/loader';
import TextExtractorControls from 'components/textExtractorControls';
import Tts from 'react-native-tts';

const { polyfill: { Blob } } = RNFetchBlob;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const api_key = '4555c0926c414a4895603a2ee29c7c46';
const { width } = Dimensions.get('window');

@reader
@extractedNotes
@connection
export default class Reader extends Component {
    state = {
      loading: false,
      autoFocus: false,
      body: '',
      isSaved: false,
      type: null,
      note: {},
      title: null,
      editedBody: [],
      modalVisible: false,
      playing: false,
      sentences: [],
      themeMode: 'light',
      currentSentence: 0,
      uploadUrl: 'https://westeurope.api.cognitive.microsoft.com/vision/v1.0/recognizeText?',
    }

    async componentWillMount() {
      const { setShowEdit, navigation: { state: { params: { images, type, isSaved, note } } } } = this.props;
      if (!isSaved) {
        this.setState({ type });

        this.ImageToBodyGenerator = function* () {
          for (let i = 0; i < images.length; i += 1) {
            yield images[i];
          }
        };

        this.setState({ loading: true });
        this.imgageToBodyIterator();
      } else {
        const { title, body } = note;
        setShowEdit(true);
        this.setState({ isSaved, title, body, note, sentences: body.split('. ') });
      }
    }

    componentWillReceiveProps(nextProps) {
      const { save, edit, themeMode, playing, setPlayMode } = nextProps;

      if (save) this.saveNote();
      if (edit) {
        this.editNote();
      }

      if (themeMode !== this.state.themeMode) {
        this.setState({ themeMode });
      }

      if (this.state.isSaved && this.state.playing !== playing && playing) {
        Tts.speak(this.state.sentences[this.state.currentSentence]);
        this.setState({ playing });
      }

      if (this.state.isSaved && this.state.playing !== playing && !playing) {
        Tts.stop();
        this.setState({ playing });
      }

      Tts.addEventListener('tts-finish', event => {
        if (this.state.currentSentence < this.state.sentences.length - 1 && this.state.playing) {
          const currentSentence = this.state.currentSentence + 1;
          this.setState({ currentSentence });
          Tts.speak(this.state.sentences[currentSentence]);
        } else {
          this.setState({ currentSentence: 0 });
          setPlayMode(false);
        }
      });
    }

    componentWillUnmount() {
      Tts.stop();
    }

    imgageToBodyIterator = async () => {
      const imgageToBodyIterate = this.ImageToBodyGenerator();

      const recurseBody = async bodies => {
        const nextImg = imgageToBodyIterate.next();

        if (!nextImg.done) {
          const body = await this.imageToBody(nextImg.value);
          return recurseBody(bodies.concat(body));
        }

        this.props.setShowSave(true);
        this.props.setShowEdit(true);
        this.setState({ loading: false, body: bodies.join() });
      };

      recurseBody([]);
    }

    imageToBody = async ({ uri }) => {
      const imageData = await fs.readFile(uri, 'base64');
      const imageBlob = await Blob.build(imageData, { type: 'image/jpg;base64' }).then(blob => blob);
      const uploadResponse = await this.uploadPhoto(imageBlob, this.state.type);
      const response = (this.state.type === 0) ? await this.receivePhotoData(uploadResponse) : uploadResponse;
      return this.prepareResponse(response);
    }

    uploadPhoto = (imageBlob, imageType) => new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      const successStatus = (imageType === 0) ? 202 : 200;

      request.onreadystatechange = e => {
        if (request.readyState !== 4) return;

        if (imageType === 1 && request.status === successStatus && request.status < 400) {
          resolve(JSON.parse(request.responseText));
        } else if (imageType === 0 && request.status === successStatus && request.status < 400) {
          resolve(request.getResponseHeader('Operation-Location'));
        } else {
          reject({ message: request.responseText });
        }
      };

      request.open('POST', `${this.state.uploadUrl}${(imageType === 0) ? 'handwriting=true' : 'handwriting=false'}`);
      request.setRequestHeader('Ocp-Apim-Subscription-Key', api_key);
      request.setRequestHeader('Content-Type', 'application/octet-stream');
      request.send(imageBlob);
    });

    prepareResponse = response => {
      let text = '';

      response.regions.forEach(r => {
        r.lines.forEach(l => {
          l.words.forEach(w => {
            text += `${w.text} `;
          });
        });
      });

      return text;
    }

    receivePhotoData = async receiveUrl => new Promise((resolve, reject) => {
      let interval = null;

      const checkResult = () => {
        fetch(`${receiveUrl}`, {
          headers: {
            'Ocp-Apim-Subscription-Key': api_key,
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data.status === 'Succeeded') {
              clearInterval(interval);
              resolve({ regions: [{ lines: data.recognitionResult.lines }] });
            }
          })
          .catch(err => {
            clearInterval(interval);
            reject(err);
          });
      };

      interval = setInterval(checkResult, 7000);
      checkResult();
    });

    saveNote = async () => {
      const { addNote, setSave, setShowSave } = this.props;
      setSave(false);
      if (this.state.title !== null) {
        const time = Date.now();
        const note = {
          title: this.state.title,
          body: this.state.body,
          time,
        };

        try {
          const noteId = addNote(note);
          note.id = noteId;
          this.setState({ isSaved: true, note, sentences: note.body.split('.') });
          setShowSave(false);
        } catch (err) {
          Alert.alert('File Error Error', err.message, [{
            label: 'OK'
          }]);
        }
      } else {
        Alert.alert('Missing Title', 'Please Add A Title To Note', [{
          label: 'OK',
          onPress: () => this.textInput.focus(),
        }]);
      }
    }

    editNote = () => {
      this.setState({
        editedBody: this.state.body.split('. '),
        modalVisible: true
      });
    }

    render() {
      const { loading, body, isSaved } = this.state;
      const bodies = body.split('. ');
      if (loading) {
        return (
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        );
      }

      return (
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            {!isSaved &&
              <TextInput
                ref={e => this.textInput = e}
                placeholder="Add Title"
                style={[main.textInput, styles.headerText]}
                autoFocus={this.state.autoFocus}
                onChangeText={title => this.setState({ title })}
              />
            }
            {isSaved && <Text style={styles.listHeaderText}>{this.state.title}</Text>}
          </View>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
          >
            <KeyboardAwareScrollView>
              <View style={{ padding: 20 }}>
                {this.state.editedBody.map((text, i) => {
                    return (
                      <TextInput
                        autoFocus={i === 0}
                        key={i}
                        onChange={e => {
                            const bodies = this.state.editedBody;
                            bodies[i] = e.nativeEvent.text;
                            this.setState({
                              editedBody: bodies
                            });
                        }}
                        multiline={true}
                        value={this.state.editedBody[i]}
                        style={styles.bodyText}
                      />
                    );
                  })}
              </View>
            </KeyboardAwareScrollView>
            <TextExtractorControls
              edittingStage={true}
              cancel={() => {
                  this.props.setEdit(false);
                  this.setState({ modalVisible: false });
                }}
              done={() => {
                  this.props.setEdit(false);
                  this.setState({ body: this.state.editedBody.join(' '), modalVisible: false }, () => {
                    if (this.state.isSaved) {
                      const note = {
                        body: this.state.body,
                        title: this.state.title
                      };
                      this.props.updateNote(this.state.note.id, note);
                    }
                  });
                }}
            />
          </Modal>
          <ScrollView style={[styles.container, { backgroundColor: this.state.themeMode === 'light' ? '#fff' : '#333' }]}>
            <View style={{ marginBottom: 100, marginTop: 20 }}>
              {bodies.map((text, i) => {
                  return (<Text key={i} style={[styles.bodyText, { color: this.state.themeMode === 'light' ? '#000' : '#fff' }]}>{text}.</Text>);
                })}
            </View>
          </ScrollView>
          <Loader />
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    flex: 1
  },

  header: {
    width,
    padding: 20,
    height: 80,
    backgroundColor: colors.accent,
  },

  headerText: {
    width: width - 40,
    height: 50,
    fontSize: 22,
    color: colors.white,
    alignItems: 'center'
  },

  topTrans: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 2,
      height: 4
    },
    shadowOpacity: 0.1
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  bodyText: {
    fontSize: 18,
    marginBottom: 15,
    lineHeight: 25
  },

  controlSpaces: {
    width,
    height: 100,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  icon: {
    width: 16,
    height: 16,
    marginRight: 15
  },

  actionTxt: {
    fontSize: 16,
    color: colors.accent,
  },

  listHeaderText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '300'
  },

  actionBttn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
