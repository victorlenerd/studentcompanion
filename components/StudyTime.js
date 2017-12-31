import React, { Component } from 'react';
import {
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    NetInfo,
    ScrollView,
    Alert,
    Text,
    AsyncStorage
} from 'react-native';

import { connect } from "react-redux";
import { main, colors } from '../shared/styles';
import { navigator } from '../shared/Navigation';

import { GetReminders, DeleteReminder } from '../ducks/Reminders';
// import RNCalendarEvents from 'react-native-calendar-events';

var { width, height } = Dimensions.get('window');

class StudyTime extends Component {
    constructor(props){
        super(props);
        this.state = {
            drawerOpen: false,
            reminders: []
        }

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
        this.props.getReminders()
        .then((reminders)=> {
            this.setState({reminders});
        })
        .catch(err=> {
            Alert.alert("Error", err.message,[
                {text: 'Cancel', style: 'cancel'},
            ]);
        });
    }

    _openScheduler() {
        navigator.reminderModal(this.props);        
    }
    
    _keyExtractor = (item, index) => index;

    _deleteReminder(index) {
        RNCalendarEvents.removeEvent(this.state.reminders[index].id);
        this.props.deleteReminder(index)
        .then((reminders)=> {
            this.setState({reminders});
        });   
    }

    render () {
        return (
            <View style={{width, height, backgroundColor: colors.lightBlue, flexDirection: "row", borderTopColor: colors.accent, borderTopWidth: 2}}>
                <ScrollView style={{flex:1}}>
                    {this.state.reminders.map((reminder, index)=> {
                        return (
                            <View key={index} style={{flex: 1, marginBottom: 2, backgroundColor: colors.white, flexDirection:"row"}}>
                                <View style={{flex: .8, alignItems: "flex-start", justifyContent: "center", height: 80, flexDirection: "column", paddingLeft: 20, paddingRight: 20}}>
                                    <View>
                                        <Text style={{fontSize: 20}}>{new Date(reminder.startDate).toTimeString().split(" ")[0]}</Text>
                                    </View>
                                    <View>
                                        <Text style={{fontSize: 16, marginTop: 5, fontWeight: "200"}}>{reminder.recurrence.toUpperCase()}</Text>
                                    </View>
                                </View>
                                <View style={{flex: .2, alignItems: "center", justifyContent: "center"}}>
                                    <TouchableOpacity onPress={()=> this._deleteReminder(index)} style={{width: 30, height: 30, alignItems: "center", justifyContent: "center", backgroundColor: colors.red, borderRadius: 15}}>
                                        <View style={{width: 15, height: 3, backgroundColor: colors.white}}></View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        )
                    })}
                </ScrollView>
                <View style={[main.fabHome, {width}]}>
                    <TouchableOpacity onPress={this._openScheduler.bind(this)} style={main.Fab}>
                        <Image source={require('../assets/add_white.png')} style={main.fabIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const mapDispatchToProps = (dispatch)=> {
    return {
        getReminders: ()=>  {
            return dispatch(GetReminders());
        },
        deleteReminder: (index)=> {
            return dispatch(DeleteReminder(index));
        }
    }
}

const mapStateToProps = (store)=> {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(StudyTime);
