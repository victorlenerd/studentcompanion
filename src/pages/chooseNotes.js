import React, { Component } from 'react';
import { View, Text, BackHandler, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import notes from 'containers/notes';
import courses from 'containers/courses';
import Tracking from 'shared/tracking';

import { main, colors } from 'shared/styles';

@notes
@courses
class ChooseNotes extends Component {
  componentWillMount() {
    Tracking.setCurrentScreen('Page_Choose_Notes');

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
  }

  _openNote = note => {
    const { navigation: { navigate }, setCurrentNote } = this.props;
    setCurrentNote(note);
    navigate('Note');
  }

  _renderSection() {
    const { currentCourse: { $id }, notes } = this.props;
    const courseNotes = notes[$id];
    if (courseNotes && courseNotes.length > 0) {
      return (
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            {courseNotes.map((note, index) => {
              return (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    borderTopWidth: 1,
                    borderTopColor: '#f1f1f1',
                    flexDirection: 'row',
                    padding: 20,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  key={note.$id}
                  onPress={() => this._openNote(note)}
                >
                  <Text style={{ color: colors.black, fontSize: 18 }}>{note.title}</Text>
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
          <Text style={main.emptyStateText}>There are no notes available.</Text>
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

export default ChooseNotes;
