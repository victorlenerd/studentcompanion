import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    TextInput,
    AsyncStorage,
    ActivityIndicator,
    TouchableOpacity,
    Alert
} from 'react-native';

import { connect } from 'react-redux';

import { navigator } from '../shared/Navigation';
import { main, pass, colors } from '../shared/styles';

import { UpdateUserDeviceId } from '../ducks/User';
import { StartRequest, FinishRequest } from '../ducks/Request';
import { addKey, clearKeys, deleteKey } from '../ducks/Pass';

class Pass extends Component {
    constructor(props){
        super(props);
    }

    done() {
        this.props.startRequest();

        this.props.updateDeviceId(this.props.pass)
        .then(()=> {
            this.props.finishRequest()
            navigator.searchCourses();
        })
        .catch((err)=> {
            Alert.alert("An Error Occured", err.message,[
                {text: 'Cancel', style: 'cancel'},
            ]);
            this.props.finishRequest()
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

    _render () {
        return(
            <View style={{flex: 1}}>
                <View style={pass.passDisplay}>
                    <TextInput
                        value={this.props.pass}
                        editable={false}
                        style={pass.passDisplayTxt}
                    />
                    <TouchableOpacity
                        onPress={()=> {
                            this.props.deleteKey();
                        }}>
                        <View>
                            <Image
                                resizeMode="contain"
                                source={require('../assets/backspace.png')}
                                style={{width: 32, height: 32}} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={pass.passBtns}>
                    {[["1","2","3"],
                        ["4","5","6"],
                        ["7","8","9"],
                        ["0","CLEAR","DONE"]
                    ].map((row, rowIndex)=> {
                            return (
                            <View key={rowIndex} style={pass.passBtnsRow}>
                                {row.map((key, index) => {
                                    let action;

                                    if (key == "DONE") {
                                        action =()=> {
                                            if  (this.props.pass.length < 1) {
                                                Alert.alert("Invalid Reset Code", "You must enter a correct reset code.",[
                                                    {text: 'Cancel', style: 'cancel'},
                                                ]);
                                                
                                            } else {
                                                this.done();
                                            }
                                        };
                                    } else if (key == "CLEAR") {
                                        action = () => { this.props.clearKeys() };
                                    } else {
                                        action = () => {
                                            return ((k)=>{ this.props.addKey(k) })(key)
                                        };
                                    }

                                    return (
                                        <View key={index} style={pass.passBtn}>
                                            <TouchableOpacity
                                                key={index}
                                                style={[{flex: 1}, pass.passBtn]}
                                                onPress={action}>
                                                    <Text style={pass.passBtnTxt}>{key}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })}
                            </View>
                        )
                    })}
                    {this.renderIndicator()}
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={main.container}>
                { this._render() }
            </View>
        )
    }
}

const mapDispatchToProps = (dispatch)=> {
    return {
        startRequest:()=> {
            dispatch(StartRequest());
        },
        finishRequest:()=> {
            dispatch(FinishRequest());
        },
        updateDeviceId:(password)=> {
            return dispatch(UpdateUserDeviceId(password));
        },
        deleteKey:()=> {
            dispatch(deleteKey());
        },
        clearKeys:()=> {
            dispatch(clearKey());
        },
        addKey:(k)=> {
            dispatch(addKey(k));
        }
    }
}

const mapStateToProps = (store) => {
  return {
      isLoading: store.requestState.status,
      pass: store.passState.pass
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(Pass);
