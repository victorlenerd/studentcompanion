import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Image,
    NetInfo,
    Alert,
    FlatList,
    ActivityIndicator
} from 'react-native';

import { connect } from "react-redux";

import { navigator } from '../shared/Navigation';
import { main,colors } from '../shared/styles';

import { GetUniversities } from '../ducks/Universities';

import { GetCurrentUser } from '../ducks/User';
import { SetIsConnected } from '../ducks/IsConnected';
import { StartRequest, FinishRequest } from '../ducks/Request';

import ListView from './ListView';

var DeviceInfo = require('react-native-device-info');
var {height, width} = Dimensions.get('window');

class SearchCourses extends Component {    
    constructor(props){
        super(props);
        this.state = {
            universities: [],
            userId: "",
            drawerOpen: false
        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.id === 'sideMenu') {
            //Do nothing
        } else if (event.id === "menu" && !this.state.drawerOpen) {
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
        const dispatchConnected =( isConnected )=> {
            this.props.setIsConnected(isConnected);

            if (isConnected) {
                this._loadData();
            }

            if  (!isConnected && this.props.isLoading) {
                this.props.finishRequest()
            }
        };

        NetInfo.isConnected.fetch().then().done((isConnected) => {
            this.props.setIsConnected(isConnected);

            NetInfo.isConnected.addEventListener('connectionChange', dispatchConnected);
            if (isConnected) {
                this._loadData();
            }

            if  (!isConnected && this.props.isLoading) {
                this.props.finishRequest()
            }
        });
    }

    _loadData() {
        this.props.startRequest();

        this.props.getCurrentUser()
        .then((user)=> {
            if  (user.deviceId !== DeviceInfo.getUniqueID()) {
                navigator.activateDevice();
            }

            if (!this.props.settingAcademicInfo && (!user.universityId || !user.facultyId || !user.departmentId)) {
                navigator.academicInfo();
            }

             this.setState({ userId: user.$id });
            this.props.finishRequest()
        })
        .catch((err)=> {
            Alert.alert("Error", err.message,[
                {text: 'Cancel', style: 'cancel'},
            ]);
        });

        this.props.getUniversities()
        .then((universities)=> {
            this.setState({ universities });
        })
        .catch((err)=> {
            Alert.alert("Error", err.message,[
                {text: 'Cancel', style: 'cancel'},
            ]);
        });
    }

    _openFacuties({ $id }) {
        let options = {
            universityId: $id,
            userId: this.state.userId
        };

        if (this.props.settingAcademicInfo) options.settingAcademicInfo = true;
        navigator.chooseFaculty(this.props, options);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <StatusBar
                    backgroundColor={"#00384D"}
                    barStyle="light-content"
                />
                <ListView 
                    title={"Choose School"}
                    isLoading={this.props.isLoading}
                    isConnected={this.props.isConnected}
                    data={this.state.universities} 
                    openItem={this._openFacuties.bind(this)}
                />
            </View>
        );
    }
}

let mapDispatchToProps =(dispatch)=> {
    return {
        startRequest:()=> {
            dispatch(StartRequest());
        },
        finishRequest:()=> {
            dispatch(FinishRequest());
        },
        setIsConnected:(isConnected)=> {
            dispatch(SetIsConnected(isConnected));
        },
        getCurrentUser:()=> {
            return dispatch(GetCurrentUser());
        },
        getUniversities:()=> {
            return dispatch(GetUniversities());
        }
    }
}

let mapStateToProps = (store) => {
    return {
        universities: store.universitiesState.universities,
        isLoading: store.requestState.status,
        isConnected: store.isConnectedState.isConnected
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchCourses);
