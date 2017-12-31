import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    TextInput,
    TouchableHighlight,
    ScrollView,
    ActivityIndicator
} from 'react-native';

import { connect } from 'react-redux';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'

import { navigator } from '../shared/Navigation';
import { main, colors } from '../shared/styles';
import { Button, ButtonInActive } from './Buttons';

import naijaNumber from 'naija-phone-number';

import { Register, Login, UserExist } from '../ducks/User';
// import { LoginWithFB } from '../ducks/User';

// var {FBLogin, FBLoginManager} = require('react-native-facebook-login');
// var provider = new firebase.auth.FacebookAuthProvider();

class SignUp extends Component {

    // _loginWithFb() {
    //     store.dispatch(LoginWithFB())
    //     .then(()=> {
    //         Actions.courses();
    //     })
    //     .catch((err)=> {
    //         Toast.show(err.message, {
    //             duration: Toast.durations.LONG,
    //             position: Toast.positions.BOTTOM,
    //             animation: true,
    //             hideOnPress: true,
    //         });
    //     });
    // }

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            phoneNumber: "",
            password: "",
            submitted: false
        }
    }

    _validEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);   
    }   

    _validPhone(phoneNumber) {
        var re = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
        return re.test(phoneNumber);
    }

    _signUp() {
        this.setState({ submitted: true });

        if (this.state.name.length < 3 ||
            !this._validEmail(this.state.email) ||
            !this._validPhone(this.state.phoneNumber) || 
            this.state.password.length < 6) {
        } else {
            this.props.signUp(this.state.name, this.state.email, this.state.phoneNumber, this.state.password);
        }
    }

    renderIndicator() {
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

    // renderFBButton() {
    //     return (<FBButton onPress={this._loginWithFb.bind(this)} text="Login With Facebook"></FBButton>);
    // }

    _renderError (condition, text) {
        if (condition) { 
            return (
                <Text style={{fontSize: 16, color: colors.red}}>{text}</Text>
            )
        }
     }

    render () {

        return (
            <View style={[main.container, {paddingTop: 50}]}>
                <KeyboardAwareScrollView>
                    <View style={[main.content, { flex:1, flexDirection:"column"}]}>
                        <View style={{flex: 0.4, justifyContent: "center", alignItems: "center"}}>
                            <View  style={main.getStartedLogo}>
                                <Image style={main.getStartedLogo} source={require('../assets/logo.png')} />
                            </View>
                        </View>
                        <View style={{flex: 0.2, paddingTop: 50}}>
                            <Text style={{fontSize: 20, fontWeight: '300', color: colors.primary, marginBottom: 20}}>Sign Up</Text>
                            
                            {this._renderError(this.state.submitted && this.state.name.length < 3, "Your name is required")}
                            <TextInput
                                placeholder="Name"
                                underlineColorAndroid="rgba(0, 0, 0, 0)"
                                style={[main.textInput, {backgroundColor: (this.state.submitted && this.state.name.length < 3) ? colors.red : colors.white, paddingLeft: 10}]}
                                onChange={(e)=> this.setState({'name': e.nativeEvent.text}) }></TextInput>
                            
                            {this._renderError(this.state.submitted && !this._validEmail(this.state.email), "Your email is required")}
                            <TextInput
                                placeholder="Email"
                                underlineColorAndroid="rgba(0, 0, 0, 0)"
                                autoCapitalize='none'
                                style={[main.textInput, {backgroundColor: (this.state.submitted && !this._validEmail(this.state.email)) ? colors.red : colors.white, paddingLeft: 10}]}
                                onChange={(e)=> this.setState({'email': e.nativeEvent.text}) }></TextInput>

                            {this._renderError(this.state.submitted && !this._validEmail(this.state.email), "Your phone number is required")}
                            <TextInput
                                placeholder="Phone Number"
                                autoCapitalize='none'
                                keyboardType="phone-pad"
                                underlineColorAndroid="rgba(0, 0, 0, 0)"
                                style={[main.textInput, {backgroundColor: (this.state.submitted && !this._validPhone(this.state.phoneNumber)) ? colors.red : colors.white, paddingLeft: 10}]}
                                onChange={(e)=> this.setState({'phoneNumber': e.nativeEvent.text}) }></TextInput>
                        
                            {this._renderError(this.state.submitted && this.state.password.length < 6, "Your password is required, it should be more than six characters.")}
                            <TextInput
                                placeholder="Password"
                                underlineColorAndroid="rgba(0, 0, 0, 0)"
                                secureTextEntry={true}
                                style={[main.textInput, {backgroundColor: (this.state.submitted && this.state.password.length < 6) ? colors.red : colors.white, paddingLeft: 10}]}
                                onChange={(e)=> this.setState({'password': e.nativeEvent.text}) }></TextInput>
                        </View>
                        <View style={{height: 100, flexDirection:"row", justifyContent: "space-between"}}>
                            <Button text="Sign Up" onPress={this._signUp.bind(this)}></Button>
                        </View>
                        <ButtonInActive onPress={()=> navigator.signIn(this.props)} text="I Already Have An Account"></ButtonInActive> 
                        <Text style={{textAlign: "center", color: "#999", fontSize: 16, marginTop: 20}}>By signing up you agree to our terms and conditions.</Text>
                    </View>
                </KeyboardAwareScrollView>
                {this.renderIndicator()}
            </View>
        );
    }
}

const mapDispatchToProps = (dispatch)=> {
    return {
        signUp: (name, email, phoneNumber, password)=> {
            dispatch(UserExist(email))
            .then(()=> {
                Alert.alert("Registration Error", "This email is registered to another user.",[
                    {text: 'Cancel', style: 'cancel'},
                ]);
            })
            .catch((value)=> {
                dispatch(Register({ name, email, phoneNumber, password }))
                .then(()=> {
                    dispatch(Login({
                        email: email,
                        password: password
                    }))
                    .then(()=> {
                        navigator.academicInfo();
                    })
                    .catch((err)=> {
                        Alert.alert("Registration Error", err.message, [
                            {text: 'Cancel', style: 'cancel'},
                        ]);
                    });

                })
                .catch((err)=> {
                    Alert.alert("Registration Error", err.message, [
                        {text: 'Cancel', style: 'cancel'},
                    ]);
                });
            });
        }
    }
}

const mapStateToProps = (store)=> {
    return {
        isLoading: store.requestState.status
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
