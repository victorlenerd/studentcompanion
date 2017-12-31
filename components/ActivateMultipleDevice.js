import React, { Component } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StatusBar,
    ScrollView,
    TouchableHighlight,
    Alert
} from 'react-native';

import { connect } from "react-redux";

import { navigator } from '../shared/Navigation';
import { main, colors } from '../shared/styles';
import { Button, ButtonInActive } from './Buttons';

import { SignOut, SendDeviceActivationCode, GetCurrentUser } from '../ducks/User';
import { StartRequest, FinishRequest } from '../ducks/Request';

class ActivateMultipleDevice extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            codeSent: false
        }
    }

    componentDidMount() {
        this.props.getCurrentUser()
        .then((user)=> {
            this.setState({
                email: user.email
            });
        })
        .catch((err)=> {
            Alert.alert("An Error Occured", err.message,[
                {text: 'Cancel', style: 'cancel'},
            ]);
        });
    }

    signout() {
        this.props.signOut()
        .then(()=> {
            navigator.intro({type: "reset"});
        },(err)=> {
            Alert.alert("An Error Occured", err.message,[
                {text: 'Cancel', style: 'cancel'},
            ]);
        });
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

    sendActivationCode() {
        this.props.startRequest();

        this.props.sendCode(this.state.email)
        .then(()=> {
            this.props.finishRequest();
            this.setState({ codeSent: true });
        })
        .catch((err)=> {
            Alert.alert("An Error Occured", err.message,[
                {text: 'Cancel', style: 'cancel'},
            ]);
        })
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

    _renderSection() {
        if (this.state.codeSent) {
            return (
                <View style={{marginTop: 100, marginBottom: 100}}>
                    <Text style={{color: colors.white, fontSize: 32, textAlign:"center", fontWeight: "200"}}>Device Acivation Code.</Text>
                    <Text style={{color: colors.white, fontSize: 18, textAlign:"center", marginBottom: 25, marginTop: 25}}>A six digit code has been sent to your email to activate this device.</Text>
                    <Button onPress={()=> { navigator.pass(); }} text="Ok, Got It!"></Button>
                    <ButtonInActive  onPress={this.sendActivationCode.bind(this)} text="Resend Code Now."></ButtonInActive>
                </View>
            )
        } else {
            return (
                <View style={{marginTop: 100, marginBottom: 100}}>
                    <Text style={{color: colors.white, fontSize: 32, textAlign:"center", fontWeight: "200"}}>Activate This Device.</Text>
                    <Text style={{color: colors.white, fontSize: 18, textAlign:"center", marginBottom: 25, marginTop: 25}}>You can't use your account on more than one device. You can deactivate the original device and activate this new device.</Text>
                    <Button onPress={this.sendActivationCode.bind(this)} text="Activate New Device"></Button>
                    <ButtonInActive  onPress={this.signout.bind(this)} text="No Not Now."></ButtonInActive>
                </View>
            )
        }
    }

    render () {
        return (
            <ScrollView style={{flex: 1, backgroundColor: colors.black}}>
                <View style={[main.container, {backgroundColor: colors.black}]}>
                    <View>
                        <StatusBar
                            backgroundColor={colors.black}
                            barStyle="light-content"
                        />
                        <View style={[main.content,{flex: 1, justifyContent:"space-between", alignItems: "center", flexDirection:"column"}]}>
                            {this._renderSection()}
                        </View>
                        {this.renderIndicator()}
                    </View>
                </View>
            </ScrollView>
        );
    }


}

const mapDispatchToProps =(dispatch)=> {
    return {
        getCurrentUser:()=> {
            return dispatch(GetCurrentUser());
        },
        startRequest:()=> {
            dispatch(StartRequest());
        },
        finishRequest:()=> {
            dispatch(FinishRequest());
        },
        sendCode:(email)=> {
            return dispatch(SendDeviceActivationCode(email))
        },
        signOut:()=> {
            return dispatch(SignOut());
        }
    }
}



const mapStateToProps = (store)=> {
    return {
        isLoading: store.requestState.status,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivateMultipleDevice);
