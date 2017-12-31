import React, { Component } from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Image,
    NetInfo,
    AsyncStorage
} from 'react-native';

import { connect } from "react-redux";
import { main, colors } from '../shared/styles';
import store from '../shared/store';

import { StartRequest, FinishRequest } from '../ducks/Request';

var {height, width} = Dimensions.get('window');

class SignOut extends Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    componentDidMount() {}

    render () {
        return (
            <View style={{flex: 1}}></View>
        );
    }
}

const mapStateToProps = (store)=> {
    return {}
};

export default connect(mapStateToProps)(SignOut);
