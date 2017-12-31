import React, { Component } from 'react';
import {
    View,
    Text,
    WebView,
    ScrollView,
    Platform
} from 'react-native';

import { connect } from "react-redux";
import { main, colors } from '../shared/styles';

class Questions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            questions: []
        }
    }

    componentDidMount() {
        let Bodify = (body)=> {
            return JSON.parse(""+body+"", (key, value)=> {
                if  (typeof value === "string") {
                    return unescape(value);
                }
                return value;
            });
        }

        this.setState({
            questions: this.props.questions.map((question, i)=> {
                question.question = Bodify(JSON.stringify(question.question));

                question.answers = question.answers.map((answer, i)=> {
                    answer.answer = Bodify(JSON.stringify(answer.answer));
                    return answer;
                });
                
                return question;
            })
        });

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

    render () {
        return (
            <View style={[main.container, {padding: 20, backgroundColor: colors.white, borderTopColor: colors.accent, borderTopWidth: 2}]}>
                <WebView
                    style={{flex: 1}}
                    javaScriptEnabled={true}
                    injectedJavaScript={`window.ContentBody(${JSON.stringify(this.props.questions)})`}
                    mediaPlaybackRequiresUserAction={true}
                    source={(Platform.OS == 'android') ? {uri: 'file:///android_asset/www/index.html'}: require('../assets/www/index.html')}>
                </WebView>
            </View>
        );
    }
}

const mapStateToProps = (store)=> {
    return {
        currentPaper: store.paperState.currentPaper,
        currentCourse: store.courseState.currentCourse,
        questions: store.questionsState.questions
    };
}

export default connect(mapStateToProps)(Questions);