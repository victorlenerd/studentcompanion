import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Dimensions,
    Image,
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

var DeviceInfo = require('react-native-device-info');

var {height, width} = Dimensions.get('window');

class ListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            data: newProps.data
        });
    }

    _keyExtractor = (item, index) => index;

    _renderItem({item, index}) {
        return (
            <TouchableOpacity key={index.toString()} onPress={()=> { this.props.openItem(item); }}  style={{width, backgroundColor:colors.white, flexDirection: "row", height: 60, marginBottom: 1, paddingLeft: 20, paddingRight: 20, alignItems: "center", justifyContent:"space-between"}}>
                <Text style={{fontSize: 18, color: colors.black}}>{item.name}</Text>
                <Image resizeMode="contain" source={require('../assets/chevron-right.png')} style={{width: 18, height: 18}} />
            </TouchableOpacity>
        )
    }

    _renderListHeader() {
        if (!this.props.isConnected) {
            return (                
                <View style={{width, height: 80, paddingLeft: 20, justifyContent:"center", backgroundColor: colors.red}}>
                    <Text style={{color: colors.white, fontSize: 22, fontWeight: "300"}}>You are offline</Text>
                </View>
            )
        } else {
            return (
                <View style={{width, height: 80, paddingLeft: 20, justifyContent:"center", backgroundColor: colors.accent}}>
                    <Text style={{color: colors.white, fontSize: 22, fontWeight: "300"}}>{this.props.title}</Text>
                </View>
            )
        }
    }

    _renderIndicator() {
        if (this.props.isLoading) {
            return (
                <View style={{position: "absolute",top: 0, left: 0, right: 0, bottom: 0, flexDirection: "row", justifyContent: "center", alignItems: "center", zIndex: 1000}}>
                    <ActivityIndicator
                        color='#fff'
                        size="large"
                        style={{width: 60, height: 60, backgroundColor: colors.black, borderRadius: 6,  flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    </ActivityIndicator>
                </View>
            )
        }
    }

    _renderEmpty() {
        return (
            <View style={{flex: 1, flexDirection: "column", justifyContent: "center", alignItems:"center"}}>
                <View style={[main.emptyState, { margin: 20 }]}>
                    <Text style={main.emptyStateText}>You Are Offline!</Text>
                </View>
            </View>
        )
    }

    render() {
        return (
           <View style={{flex: 1, backgroundColor: colors.lightBlue, borderTopColor: colors.accent, borderTopWidth: 2}}>
                <FlatList 
                    data={this.state.data}
                    keyExtractor={this._keyExtractor}
                    ListHeaderComponent={this._renderListHeader.bind(this)}
                    ListEmptyComponent={this._renderEmpty()}
                    renderItem={this._renderItem.bind(this)}
                />
                {this._renderIndicator()}
            </View>
        );
    }
}

export default ListView;
