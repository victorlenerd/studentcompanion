import React, { Component } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StatusBar,
    ScrollView,
    TouchableHighlight
} from 'react-native';

import { connect } from "react-redux";

import { main, colors } from '../shared/styles';
import { navigator } from '../shared/Navigation';
import { Button, ButtonInActive } from './Buttons';

import { GetPrice } from '../ducks/Price';

class ActivateAccount extends Component {
    constructor(props){
        super(props);
        this.state = {
            price: 0
        }
    }

    componentDidMount() {}

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

    render() {
        return (
            <ScrollView style={{flex: 1, backgroundColor: colors.black}}>
                <View style={[main.container, {backgroundColor: colors.black}]}>
                    <StatusBar
                        backgroundColor={colors.black}
                        barStyle="light-content"
                    />
                    <View style={[main.content,{flex: 1, justifyContent:"space-between", alignItems: "center",  backgroundColor: colors.black, flexDirection:"column"}]}>
                        <View style={{marginTop: 100, marginBottom: 100}}>
                            <Text style={{color: colors.white, fontSize: 32, textAlign:"center", fontWeight: "200"}}>Renew Your Subscription.</Text>

                            <Text style={{color: colors.white, fontSize: 18, textAlign:"center", marginTop: 50, marginBottom: 50}}>Sorry your subscription has expired. Renew your subscription and get unlimited acces to resources.</Text>
                    
                            <Button onPress={()=> {navigator.payment(this.props, 10000);}} text="₦100 For A Month" />
                            <Button onPress={()=> {navigator.payment(this.props, 100000);}} text="₦1000 For A Year" />
                        </View>
                    </View>
                    {this.renderIndicator()}
                </View>
            </ScrollView>
        );
    }
}

let mapDispatchToProps =(dispatch)=> {
    return {
        getPrice: ()=> {
            dispatch(GetPrice());
        }
    }
}

let mapStateToProps =(store) => {
    return {
        isLoading: store.requestState.status,
        price: store.priceState.price
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivateAccount);