import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    Dimensions,
    TouchableOpacity,
    Image,
    Picker,
    ActivityIndicator,
    ScrollView,
    NetInfo,
    Modal,
    Alert,
    ViewPagerAndroid
} from 'react-native';

import { connect } from "react-redux";
import { find, capitalize } from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import ImagePicker from 'react-native-image-picker';
import Swiper from 'react-native-swiper';


import { GetCurrentUser, TransferRequest } from '../ducks/User';
import { GetPhotoNotes, AddPhotoNote } from '../ducks/PhotoNotes';
import { GetPricePerPhoto } from '../ducks/Price';
import { main, colors } from '../shared/styles';
import { StartRequest, FinishRequest } from '../ducks/Request';
import { Button, ButtonInActive } from './Buttons';

const { height, width } = Dimensions.get('window');

class PhotoNotes extends Component {
    constructor(props){
        super(props);
        this.state = {
            drawerOpen: false,
            modalVisible: false,
            type: ["Note", "Past Questions"],
            semesters: ["First", "Second"],
            selectedType: "Note",
            selectedSemester: "First",
            userId: "",
            school: "",
            faculty: "",
            department: "",
            level: "",
            semester: "",
            courseName: "",
            courseCode: "",
            submitted: false,
            images: [],
            approvedPhotos: [],
            pricePerPhoto: 0,
            amountMade: 0,
            uploadState: 0,
            photoNotes: [],
            ready: false
        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.id === 'sideMenu') {
            //Do nothing
        }  else if (event.id === "menu" && !this.state.drawerOpen) {
            this.props.navigator.toggleDrawer({
                side: 'left',
                animated: true,
                to: 'open'
            });
            this.setState({drawerOpen: true});
        } else {
            this.props.navigator.toggleDrawer({
                side: 'left',
                animated: true,
                to: 'closed'
            });
            this.setState({drawerOpen: false});
        }
    }

    componentDidMount() {
        this.props.getCurrentUser()
        .then(( user )=> {
            this.setState({
                userId: user.$id
            });

            Promise.all([
                this.props.getPhotoNotes(user.$id)
            ])
            .then(( results )=>{
                let photoNotes = results[0];
                let cCodes = [];
                let notesPhotos = [];

                photoNotes.forEach(photoNote => {
                    if (cCodes.indexOf(photoNote.courseCode) !== -1) return false;
                    cCodes.push(photoNote.courseCode);
                    notesPhotos.push(photoNote);
                });

                this.setState({ photoNotes: notesPhotos });
            })
            .catch(()=> {
                Alert.alert("Err!", err.message,[
                    {text: 'Cancel', style: 'cancel'},
                ]);
            });
        })
        .catch((err)=> {
            Alert.alert("Err!", err.message,[
                {text: 'Cancel', style: 'cancel'},
            ]);
        });
    }

    _done = () => {
        this.setState({
            submitted: true
        });

        if (this.state.images.length < 1) {
            Alert.alert("Err!", "You need to upload some photos",[
                {text: 'Cancel', style: 'cancel'},
            ]);
        }  else {
            let newPhotoNote = {
                userId: this.state.userId,
                type: this.state.selectedType,
                school: this.state.school,
                faculty: this.state.faculty,
                department: this.state.department,
                level: this.state.level,
                semester: this.state.semester,
                courseName: this.state.courseName,
                courseCode: this.state.courseCode,
                images: this.state.images,
                status: "Pending",
                dataAdded: new Date().toISOString()
            };

            this.props.startRequest();
            this.props.addPhotoNote(newPhotoNote)
            .then(()=> {
                this._cancel();
                this.props.finishRequest();
            })
            .catch(err=> {
                Alert.alert("Err!", err,[
                    {text: 'Cancel', style: 'cancel'},
                ]);
                this.props.finishRequest();
            });
        }
    }

    _isFormValid = () => {
        if (this.state.school.length < 1|| this.state.faculty.length < 1 ||
            this.state.department.length < 1 || this.state.level.length < 1 || this.state.selectedSemester.length < 1 ||
            this.state.courseName.length < 1 || this.state.courseCode.length < 1) {
            Alert.alert("Err!", "Some fields are empty",[
                {text: 'Cancel', style: 'cancel'},
            ]);

            return false;
        }

        return true;
    }

    _next = () => {
        if (this._isFormValid()) {
            this.setState({ uploadState: 1 });
        }
    }

    _addPhoto = () => {
        ImagePicker.launchImageLibrary({ storageOptions: { path: 'studentcompanion' } }, (response)  => {
            const { fileName: name, path, data } = response;
            const img = find(this.state.images, ["name", name]);
            if (img) return Alert.alert("Image Added Before", "You already added this image", [{ text: 'ok' }]);

            if (!img && !response) return false;
            
            this.setState({
                images: this.state.images.concat({
                    name,
                    path,
                    data
                })
            });
        });
    } 

    _cancel = () => {
        this.setState({
            modalVisible: false,
            school: "",
            faculty: "",
            department: "",
            level: "",
            semester: "",
            courseName: "",
            courseCode: "",
            uploadState: 0,
            images: [],
            submitted: false,
            ready: false,
        });
    }

    _renderDotIndicator() {
        return <PagerDotIndicator pageCount={this.state.images.length} />;
    }

    _renderIndicator() {
        if (this.props.isLoading) {
            return (
                <View style={{position: "absolute",top: 0, left: 0, right: 0, bottom: 0, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <ActivityIndicator
                        color='#fff'
                        size="large"
                        style={{width: 60, height: 60, backgroundColor: colors.black, borderRadius: 6,  flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    </ActivityIndicator>
                </View>
            )
        }
    }

    _renderError (condition, text) {
        if (condition) {
            return (
                <Text style={{fontSize: 16, color: colors.red}}>{text}</Text>
            )
        }
    }

    _renderImages = () => {
        if (this.state.images.length > 0) {
            return (
                <Swiper style={{flex: 1}}>
                    {this.state.images.map((img, i)=> {
                        if (img.data) { 
                            return (
                                <View key={i} style={{flex: 1}}>
                                    <Image source={{uri: `data:image/jpg;base64,${img.data}`, cache: true}} resizeMode="center" style={{flex: 1}}  />
                                </View>
                            );
                        }
                    })}
                </Swiper>
            );
        }

        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <View style={[main.emptyState]}>
                    <Text style={main.emptyStateText}>You have not uploaded any photos.</Text>
                </View>
            </View>
        );
    }

    _renderModal = () => {
        const { uploadState } = this.state;

        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {alert("Modal has been closed.")}}>
                {uploadState == 0 && <View style={{flex: 1, backgroundColor: colors.lightBlue}}>
                    <KeyboardAwareScrollView style={{flex: 0.8, flexDirection: "column", paddingTop: 50}}>
                        <View style={{padding: 20}}>
                            <Text style={{color: colors.black, fontSize: 22}}>New Uploads</Text>
                            <View style={{marginTop: 30}}>
                                <Text style={{color: colors.black, fontSize: 18}}>Upload Type</Text>
                                <Picker
                                    selectedValue={this.state.selectedType}
                                    onValueChange={(type)=> this.setState({selectedType: type})}>
                                    {this.state.type.map((type, index)=> {
                                        return (
                                            <Picker.Item
                                                key={index}
                                                value={type}
                                                label={type}>
                                            </Picker.Item>
                                        )
                                    })}
                                </Picker>
                            </View>
                            <View style={{marginTop: 25}}>
                                <TextInput
                                    autoCapitalize='none'
                                    placeholder="School"
                                    onChange={(e)=> this.setState({'school': e.nativeEvent.text}) }
                                    style={[main.textInput, {backgroundColor: (this.state.submitted && this.state.school.length < 1) ? colors.red : colors.white, paddingLeft: 10}]} />
                            </View>
                            <View style={{marginTop: 25}}>
                                <TextInput
                                    autoCapitalize='none'
                                    placeholder="Faculty"
                                    onChange={(e)=> this.setState({'faculty': e.nativeEvent.text}) }
                                    style={[main.textInput, {backgroundColor: (this.state.submitted && this.state.faculty.length < 1) ? colors.red : colors.white, paddingLeft: 10}]} />
                            </View>
                            <View style={{marginTop: 25}}>
                                <TextInput
                                    autoCapitalize='none'
                                    placeholder="Department"
                                    onChange={(e)=> this.setState({'department': e.nativeEvent.text}) }
                                    style={[main.textInput, {backgroundColor: (this.state.submitted && this.state.department.length < 1) ? colors.red : colors.white, paddingLeft: 10}]} />
                            </View>
                            <View style={{marginTop: 25}}>
                                <TextInput
                                    autoCapitalize='none'
                                    placeholder="Level"
                                    onChange={(e)=> this.setState({'level': e.nativeEvent.text}) }
                                    style={[main.textInput, {backgroundColor: (this.state.submitted && this.state.level.length < 1) ? colors.red : colors.white, paddingLeft: 10}]} />
                            </View>
                            <View style={{marginTop: 25}}>
                                <Text style={{color: colors.black, fontSize: 18}}>Semester</Text>
                                <Picker
                                    selectedValue={this.state.selectedSemester}
                                    onValueChange={(sem)=> this.setState({selectedSemester: sem})}>
                                    {this.state.semesters.map((type, index)=> {
                                        return (
                                            <Picker.Item
                                                key={index}
                                                value={type}
                                                label={type}>
                                            </Picker.Item>
                                        )
                                    })}
                                </Picker>
                            </View>
                            <View style={{marginTop: 25}}>
                                <TextInput
                                    autoCapitalize='none'
                                    placeholder="Course Name"
                                    onChange={(e)=> this.setState({'courseName': e.nativeEvent.text}) }
                                    style={[main.textInput, {backgroundColor: (this.state.submitted && this.state.courseName.length < 1) ? colors.red : colors.white, paddingLeft: 10}]} />
                            </View>
                            <View style={{marginTop: 25}}>
                                <TextInput
                                    autoCapitalize='none'
                                    placeholder="Course Code"
                                    onChange={(e)=> this.setState({'courseCode': e.nativeEvent.text}) }
                                    style={[main.textInput, {backgroundColor: (this.state.submitted && this.state.courseCode.length < 1) ? colors.red : colors.white, paddingLeft: 10}]} />
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                    <View style={{width, paddingLeft: 25, paddingRight: 25, flex: 0.2, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <ButtonInActive text="Cancel" onPress={this._cancel} />
                        <Button text="Next" onPress={this._next} />
                    </View>
                </View>}
                {uploadState == 1 && <View style={{flex: 1, backgroundColor: colors.lightBlue}}>
                    <View style={{ flexDirection: 'row', width, marginVertical: 25, paddingLeft: 25, paddingRight: 25, height: 50, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{fontSize: 20, fontWeight: "300"}}>{this.state.images.length} Photos</Text>
                        <Button text="Add Photo" onPress={this._addPhoto} />
                    </View>
                    {this.state.images.length > 0 && this._renderImages()}
                    {this.state.images.length < 1 && <View style={{flex: 1}} />}
                    <View style={{width, paddingLeft: 25, paddingRight: 25, flex: 0.2, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <ButtonInActive text="Cancel" onPress={this._cancel} />
                        <Button text="Done" onPress={this._done} />
                    </View>
                </View>}
                {this._renderIndicator()}
            </Modal>
        )
    }

    _renderSection() {
        if (this.state.photoNotes.length > 0) {
            return (
                <ScrollView style={{flex:1}}>
                    {this.state.photoNotes.map((photoNote, index)=> {
                        let statusColor;

                        if  (photoNote.status.toLowerCase() === "pending") {
                            statusColor = colors.yellow
                        } else if (photoNote.status.toLowerCase() === "approved")  {
                            statusColor = colors.green
                        } else {
                            statusColor = colors.red
                        }

                        return (
                            <TouchableOpacity onPress={()=> {
                                this.setState({
                                    modalVisible: true,
                                    school: photoNote.school,
                                    faculty: photoNote.faculty,
                                    department: photoNote.department,
                                    level: photoNote.level,
                                    semester: photoNote.semester,
                                    courseName: photoNote.courseName,
                                    courseCode: photoNote.courseCode,
                                    uploadState: 1
                                });
                            }} key={index} style={{flex: 1, marginBottom: 2, backgroundColor: colors.white, flexDirection:"row"}}>
                                <View style={{flex: .8, alignItems: "flex-start", justifyContent: "center", paddingVertical: 10, flexDirection: "column", paddingLeft: 20}}>
                                    <View>
                                        <Text style={{fontSize: 20, color: '#000'}}>{photoNote.type}</Text>
                                    </View>
                                    <View>
                                        <Text style={{fontSize: 16, marginTop: 5, fontWeight: "200", color: '#000'}}>{capitalize(photoNote.faculty)} - {capitalize(photoNote.department)}</Text>
                                    </View>
                                    <View>
                                        <Text style={{fontSize: 16, marginTop: 5, fontWeight: "200", color: '#000'}}>{capitalize(photoNote.courseCode)} - {capitalize(photoNote.courseName)}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            );
        } else {
            return (
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <View style={[main.emptyState]}>
                        <Text style={main.emptyStateText}>You have not uploaded any photos.</Text>
                    </View>
                </View>
            );
        }
    }

    renderOfflineBanner() {
        if (!this.props.isConnected) {
            return (
                <View style={{width, height: 80, paddingLeft: 20, justifyContent:"center", backgroundColor: colors.red}}>
                    <Text style={{color: colors.white, fontSize: 22, fontWeight: "300"}}>You are offline!</Text>
                </View>
            )
        }
    }

    render () {
        return (
            <View style={{width,height, flexDirection: "row", backgroundColor: colors.lightBlue, borderTopColor: colors.accent, borderTopWidth: 2}}>
                {this.renderOfflineBanner()}
                {this._renderModal()}
                {this._renderSection()}
                <View style={[main.fabHome, {width}]}>
                    <TouchableOpacity onPress={()=> {
                        this.setState({
                            modalVisible: true
                        });
                    }} style={main.Fab}>
                        <Image source={require('../assets/add_white.png')} style={main.fabIcon} />
                    </TouchableOpacity>
                </View>
                {this._renderIndicator()}
            </View>
        );
    }
}

const mapDispatchToProps = (dispatch)=>  {
    return {
        getCurrentUser: ()=> {
            return dispatch(GetCurrentUser());
        },
        startRequest: ()=> {
            dispatch(StartRequest());
        },
        finishRequest: ()=> {
            dispatch(FinishRequest());
        },
        addPhotoNote: (photoNote)=> {
            return dispatch(AddPhotoNote(photoNote));
        },
        getPhotoNotes: (userId)=> {
            return dispatch(GetPhotoNotes(userId));
        },
        getPricePerPhoto: ()=> {
            return dispatch(GetPricePerPhoto());
        },
        transferRequest: (userId, amount, approvedPhotoNotes)=> {
            return dispatch(TransferRequest(userId, amount, approvedPhotoNotes));
        }
    }
}

const mapStateToProps = (store)=> {
    return {
        universities: store.universitiesState.universities,
        isLoading: store.requestState.status,
        isConnected: store.isConnectedState.isConnected
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoNotes);
