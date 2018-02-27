import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';

import papers from 'containers/papers';
import questions from 'containers/questions';
import courses from 'containers/courses'

import { main, colors } from 'shared/styles';

@papers
@questions
@courses
class ChoosePapers extends Component {
  _openPaper = async paper => {
    const { navigation: { navigate }, setCurrentPaper, getQuestions, getQuestionsOffline } = this.props;
    setCurrentPaper(paper);

    if (!this.props.offlineMode) {
      await getQuestions(paper.$id);
      navigate('Questions');
    } else {
      await getQuestionsOffline(paper.courseId, paper.$id);
      navigate('Questions');
    }
  }

  _renderSection() {
    const { currentCourse: { $id }, papers } = this.props;
    const coursePapers = papers[$id];

    if (coursePapers && coursePapers.length > 0) {
      return (
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            {coursePapers.map((paper, index) => {
                return (
                  <TouchableOpacity style={{ flex: 1 }} key={paper.$id} onPress={() => this._openPaper(paper)}>
                    <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#f1f1f1' }}>
                      <Text style={{ color: colors.black, fontSize: 18 }}>{paper.date}</Text>
                    </View>
                  </TouchableOpacity>
                );
            })}
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <View style={[main.emptyState, { margin: 20 }]}>
          <Text style={main.emptyStateText}>There are no past questions available yet.</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={main.container}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <View style={[main.content, { flex: 1, padding: 0 }]}>
          <View style={{ flex: 1, backgroundColor: colors.white, flexDirection: 'column', elevation: 2 }}>
            {this._renderSection()}
          </View>
        </View>
      </View>
    );
  }
}

export default ChoosePapers;
