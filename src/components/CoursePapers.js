import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StatusBar, Platform } from 'react-native';

import { connect } from 'react-redux';

import store from '../shared/store';
import { main, colors } from '../shared/styles';
import { navigator } from '../shared/Navigation';

import { GetQuestions, GetQuestionsOffline } from '../ducks/Questions';
import { SetCurrentPaper } from '../ducks/Papers';

class CoursePapers extends Component {
  _openPaper(paper) {
    store.dispatch(SetCurrentPaper(paper));

    if (!this.props.offlineMode) {
      store.dispatch(GetQuestions(paper.$id)).then(() => {
        navigator.questions(this.props);
      });
    } else {
      store.dispatch(GetQuestionsOffline(paper.courseId, paper.$id)).then(() => {
        navigator.questions(this.props);
      });
    }
  }

  _renderSection() {
    if (this.props.papers.length > 0) {
      return (
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            {this.props.papers.map((paper, index) => {
              return (
                <TouchableOpacity style={{ flex: 1 }} key={index} onPress={() => this._openPaper(paper)}>
                  <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#f1f1f1' }}>
                    <Text style={{ color: colors.black, fontSize: 18 }}>{paper.date}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <View style={[main.emptyState, { margin: 20 }]}>
            <Text style={main.emptyStateText}>There are no exams available.</Text>
          </View>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={main.container}>
        <StatusBar backgroundColor={'#00384D'} barStyle="light-content" />
        <View style={[main.content, { flex: 1, padding: 0 }]}>
          <View style={{ flex: 1, backgroundColor: colors.white, flexDirection: 'column', elevation: 2 }}>
            {this._renderSection()}
          </View>
        </View>
      </View>
    );
  }
}

export default CoursePapers;
