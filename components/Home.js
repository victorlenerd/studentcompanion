import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StatusBar,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import { connect } from "react-redux";
import { main, colors } from '../shared/styles';

import { navigator } from '../shared/Navigation';

var { width, height } = Dimensions.get('window');

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
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

    render () {
        return (
            <View style={{width,height, flexDirection: "row", backgroundColor: colors.lightBlue, borderTopColor: colors.accent, borderTopWidth: 2}}>
                <StatusBar
                    backgroundColor={"#00384D"}
                    barStyle="light-content"
                />
                <View style={{flex: .5, flexDirection: "column"}}>
                    <TouchableOpacity onPress={()=> {
                        this.props.navigator.push({
                            screen: 'UPQ.SearchCourses',
                            title: 'Search Courses',
                            navigatorStyle: {
                                navBarButtonColor: colors.white,
                                navBarBackgroundColor: colors.primary,
                                navBarTextColor: colors.white
                            }
                        });
                    }} style={{flex: .4, borderWidth: 1, borderColor: "#eee", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <Image resizeMode="contain" source={require('../assets/search-accent.png')} style={{width: 32, height: 32}} />
                        <Text style={{fontSize: 18, fontWeight: "bold", color: colors.black, marginTop: 20}}>Search</Text>
                        <Text style={{fontSize: 14, fontWeight: "bold", color: colors.gray, textAlign: "center", marginTop: 20}}>Find study resources by school or subject.</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> {
                        this.props.navigator.push({
                            screen: 'UPQ.PhotoNotes',
                            title: 'Search Courses',
                            navigatorStyle: {
                                navBarButtonColor: colors.white,
                                navBarBackgroundColor: colors.primary,
                                navBarTextColor: colors.white
                            }
                        });
                    }} style={{flex: .6, borderWidth: 1, borderColor: "#eee", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <Image resizeMode="contain" source={require('../assets/file-picture-accent.png')} style={{width: 32, height: 32}} />
                        <Text style={{fontSize: 18, fontWeight: "bold", color: colors.black, marginTop: 20}}>Upload Photos</Text>
                        <Text style={{fontSize: 14, fontWeight: "bold", color: colors.gray, textAlign: "center", marginTop: 20}}>Upload photos of your notes to help us grow.</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex: .5, flexDirection: "column"}}>
                    <TouchableOpacity onPress={()=>{
                        this.props.navigator.push({
                            screen: 'UPQ.SavedCourses',
                            title: 'My Courses',
                            navigatorStyle: {
                                navBarButtonColor: colors.white,
                                navBarBackgroundColor: colors.primary,
                                navBarTextColor: colors.white
                            }
                        });
                    }} style={{flex: .4,  borderWidth: 1, borderColor: "#eee", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <Image resizeMode="contain" source={require('../assets/open-book-black-accent.png')} style={{width: 32, height: 32}} />
                        <Text style={{fontSize: 18, fontWeight: "bold", color: colors.black, marginTop: 20}}>My Course</Text>
                        <Text style={{fontSize: 14, fontWeight: "bold", color: colors.gray, textAlign: "center", marginTop: 20}}>Find resources you have saved on you phone.</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={()=> {
                       this.props.navigator.push({
                            screen: 'UPQ.Feedback',
                            title: 'Feedback',
                            navigatorStyle: {
                                navBarButtonColor: colors.white,
                                navBarBackgroundColor: colors.primary,
                                navBarTextColor: colors.white
                            }
                        }); 
                    }} style={{flex: .6,  borderWidth: 1, borderColor: "#eee",  flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <Image resizeMode="contain" source={require('../assets/bubble-orange.png')} style={{width: 32, height: 32}} />
                        <Text style={{fontSize: 18, fontWeight: "bold", color: colors.black, marginTop: 20}}>Feedback</Text>
                        <Text style={{fontSize: 14, fontWeight: "bold", color: colors.gray, textAlign: "center", marginTop: 20}}>We would love to hear from you.</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (store)=> {
    return {}
};

export default connect(mapStateToProps)(Home);
