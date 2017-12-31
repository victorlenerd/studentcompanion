import React, { Component } from 'react';
import {
    View,
    Text,
    Dimensions,
    ScrollView
} from 'react-native';

import { connect } from "react-redux";
import { main, colors } from '../shared/styles';

// var SummaryTool = require('node-summary');
var {height, width} = Dimensions.get('window');

class Summarized extends Component {
    constructor(props) {
        super(props);
        this.state = {
            summary: ""
        }
    }

    componentDidMount() {
        SummaryTool.summarize(this.props.title, this.props.text, (err, summary)=> {
            if(err) console.log("Something went wrong man!");
            this.setState({ summary });
        });
    }

    render () {
        return (
            <ScrollView style={{width, height, flexDirection: "column", backgroundColor: colors.lightBlue, borderTopColor: colors.accent, borderTopWidth: 2, padding: 20}}>
                <Text style={{fontSize: 16, paddingBottom: 150, color: colors.black}}>{this.state.summary}</Text>
            </ScrollView>
        );
    }
}


export default connect()(Summarized);
