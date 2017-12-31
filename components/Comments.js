import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    Alert
} from 'react-native';

import moment from 'moment';
import { connect } from "react-redux";
import { main, colors } from '../shared/styles';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

import { GetCurrentUser } from '../ducks/User';
import { StartRequest, FinishRequest } from '../ducks/Request';
import { GetComments, PostComments } from '../ducks/Comments';

import { Button } from './Buttons';

var {height, width} = Dimensions.get('window');

moment.updateLocale('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s AGO",
        s  : 'A FEW SECS',
        ss : '%d SECS',
        m:  "a MIN",
        mm: "%d MINS",
        h:  "AN HOUR",
        hh: "%d HOURS",
        d:  "A DAY",
        dd: "%d DAYS",
        M:  "A MONTHS",
        MM: "%d MONTHS",
        y:  "A YEAR",
        yy: "%d YEARS"
    }
});

class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: "",
            userId: "",
            name: "",
            isReply: false,
            repliedComment: {},
            comments: []
        }
    }

    componentDidMount() {
        this.props.startRequest();

        this.props.getCurrentUser()
        .then((user)=> {
            this.setState({ userId: user.$id, name: user.name});
            this.props.getComments(this.props.currentNote.$id)
            .then(comments=> {
                this.setState({comments});
                this.props.finishRequest();
            })
            .catch(err=> {
                Alert.alert("Error", err.message,[
                    {text: 'Cancel', style: 'cancel'},
                ]);
                this.props.finishRequest();
            });
        })
        .catch(err=> {
            Alert.alert("Error", err.message, [
                {text: 'Cancel', style: 'cancel'},
            ]);
            this.props.finishRequest(); 
        });
    }

    _renderIndicator() {
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

    _renderIsReply() {
        if (this.state.isReply) {
            return (
                <View style={{width, height: 50, padding:20, borderTopColor: colors.accent, borderTopWidth: 2, justifyContent: "flex-start", alignItems: "center", flexDirection: "row", backgroundColor: colors.white}}>
                    <View style={{flex: .8}}>
                        <Text style={{fontSize: 12, fontWeight: "bold", color: colors.accent, marginRight: 15}}>REPLY TO:</Text>         
                        <Text style={{fontSize: 12, color: colors.black}}>{this.state.repliedComment.name}</Text> 
                    </View>     
                    <View style={{flex: .2, justifyContent: "flex-end", alignItems: "flex-end"}}>
                        <TouchableOpacity onPress={()=> {
                            this.setState({
                                isReply: false,
                                repliedComment: {}
                            });
                        }}>
                            <Text style={{fontSize: 12, color: colors.primary}}>CANCEL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }

    _timeAgo(timeString) {
        return moment(timeString).fromNow();
    }

    _submitComment() {
        if (this.state.comment.length > 1) {
            this.props.startRequest();
            let newComment = {
                comment: this.state.comment,
                userId: this.state.userId,
                name: this.state.name,
                type: "note",
                noteId: this.props.currentNote.$id,
                isReply: this.state.isReply,
                repliedComment: this.state.repliedComment,
                dateAdded: new Date().toISOString()
            }

            this.props.sendComment(newComment)
            .then(()=> {
                this.setState({
                    comments: this.state.comments.concat(newComment),
                    comment: "",
                    isReply: false,
                    repliedComment: {}
                });
                this.props.finishRequest();
            })
            .catch(()=> {
                this.props.finishRequest();
            });
        }
    }

    _renderIndicator() {
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
        if (!this.props.isConnected) {
            return (
                <View style={{flex: 1, flexDirection: "column", justifyContent: "center", alignItems:"center", borderTopColor: colors.accent, borderTopWidth: 2}}>
                    <View style={[main.emptyState, { margin: 20 }]}>
                        <Text style={main.emptyStateText}>You Are Offline!</Text>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={{flex: 1, flexDirection: "column", backgroundColor: colors.lightBlue, borderTopColor: colors.accent, borderTopWidth: 2}}>
                    <View style={{flex: 1}}>
                        <ScrollView style={{padding: 20}}>
                            {this.state.comments.map((comment, index)=> {
                                let renderReplied = (comment)=>  {
                                    if (comment.isReply) {
                                        return (
                                            <View style={{marginBottom: 20, borderBottomColor: "#eee", borderBottomWidth: 1, borderTopColor: "#eee", borderTopWidth: 1, paddingTop: 20, paddingBottom: 20}}>
                                                <Text style={{fontSize: 8, fontWeight: "bold", color: colors.accent, marginRight: 15, marginTop: 5}}>REPLY TO:</Text>         
                                                <Text style={{fontSize: 12, color: colors.black, marginBottom: 5, marginTop: 5}}>{comment.repliedComment.name}</Text> 
                                                <Text numberOfLines={2} ellipsizeMode="middle" style={{fontSize: 16, color: colors.black, marginBottom: 5}}>{comment.repliedComment.comment}</Text>
                                            </View>
                                        )
                                    }
                                }

                                return (
                                    <View key={index} style={{flex: 1, marginBottom: 1, padding: 20, backgroundColor: colors.white}}>
                                        {renderReplied(comment)}
                                        <Text style={{fontSize: 12, marginBottom: 10, color: colors.black}}>{comment.name}</Text>
                                        <Text style={{fontSize: 16, color: colors.black}}>{comment.comment}</Text>
                                        <View style={{flex: 1, marginTop: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                            <TouchableOpacity onPress={()=> {
                                                this.setState({
                                                    isReply: true,
                                                    repliedComment: comment
                                                })
                                            }}>
                                                <Text style={{fontSize: 12,  color: colors.primary}}>REPLY</Text>
                                            </TouchableOpacity>
                                            <Text style={{fontSize: 12, color: colors.gray}}>{this._timeAgo(comment.dateAdded)}</Text>
                                        </View>
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </View>
                    {this._renderIsReply()}
                    <View style={{width, height: 60, flexDirection: "row", backgroundColor: colors.white, borderTopColor: "#eee", borderTopWidth: 1}}>
                        <View style={{flex: .8, flexDirection:"column"}}>
                            <TextInput
                                placeholder="Enter you comment"
                                autoCapitalize='none'
                                multiline={true}
                                underlineColorAndroid="rgba(0, 0, 0, 0)"
                                value={this.state.comment}
                                style={[main.textInput, {height: 60, paddingLeft: 10, fontSize: 18}]}
                                onChange={(e)=> this.setState({'comment': e.nativeEvent.text}) }></TextInput>
                        </View>
                        <View style={{flex: .2, justifyContent: "center", alignItems:"center"}}>
                            <TouchableOpacity onPress={this._submitComment.bind(this)}>
                                <Image source={require('../assets/send.png')} style={{width: 32, height: 32}} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this._renderIndicator()}
                </View>
            )
        }
    }

    render () {
        return (
            <KeyboardAwareScrollView>
                {this._renderSection()}
            </KeyboardAwareScrollView>
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
        getCurrentUser: ()=> {
            return dispatch(GetCurrentUser());
        },
        getComments: (noteId)=> {
            return dispatch(GetComments("note", noteId));
        },
        sendComment: (comment)=> {
            console.log("sendComment::comments", comment);
            return dispatch(PostComments(comment));
        }
    }
}

const mapStateToProps = (store)=> {
    return {
        isLoading: store.requestState.status,
        isConnected: store.isConnectedState.isConnected,
        currentNote: store.notesState.currentNote,
        currentPaper: store.paperState.currentPaper,
        currentCourse: store.courseState.currentCourse
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
