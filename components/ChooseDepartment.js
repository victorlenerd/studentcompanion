import React, { Component } from 'react';
import {
    View,
    Text,
    Alert,
    Image,
    FlatList,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';

import { connect } from "react-redux";
import { main, colors } from '../shared/styles';
import { navigator } from '../shared/Navigation';

import { StartRequest, FinishRequest } from '../ducks/Request';
import { GetDepartmentsByFacultyId } from '../ducks/Departments.js';

var {height, width} = Dimensions.get('window');

import ListView from './ListView';

class ChooseDeparment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            departments: []
        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) { 
        if (event.id === "menu" && !this.state.drawerOpen) {
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
        this.props.startRequest();
        this.props.getDepartments(this.props.facultyId)
        .then((departments)=> {
            this.setState({departments});
            this.props.finishRequest();
        })
        .catch((err)=> {
            Alert.alert("Error", err.message,[
                {text: 'Cancel', style: 'cancel'},
            ]);
        });
    }

    _openLevel({$id}) {
        let options = {
            userId: this.props.userId,
            universityId: this.props.universityId,
            facultyId: this.props.facultyId,
            departmentId: $id
        }; 

        if (this.props.settingAcademicInfo) options.settingAcademicInfo = true;
        
        navigator.chooseLevel(this.props, options);
    }

    render () {
        return (
            <ListView 
                title={"Choose Department"}
                isLoading={this.props.isLoading}
                isConnected={this.props.isConnected}
                data={this.state.departments} 
                openItem={this._openLevel.bind(this)}
            />
        );
    }
}


const mapDispatchToProps = (dispatch)=> {
    return {
        startRequest: ()=> {
            dispatch(StartRequest());
        },
        finishRequest: ()=> {
            dispatch(FinishRequest());
        },
        getDepartments: (facultyId)=> {
            return dispatch(GetDepartmentsByFacultyId(facultyId));
        }
    }
}

const mapStateToProps = (store)=> {
    return {
        isLoading: store.requestState.status,
        isConnected: store.isConnectedState.isConnected
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseDeparment);
