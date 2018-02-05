import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StatusBar, Platform } from 'react-native';

import { connect } from 'react-redux';

import { main, colors } from '../shared/styles';
import store from '../shared/store';
import { navigator } from '../shared/Navigation';

import { SetCurrentNote } from '../ducks/Notes';

class CourseNotes extends Component {
  _openNote(note) {
    store.dispatch(SetCurrentNote(note));
    navigator.note(this.props, note.title);
  }

  _renderSection() {
    if (this.props.notes.length > 0) {
      return (
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            {this.props.notes.map((note, index) => {
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
                  key={index}
                  onPress={() => this._openNote(note)}
                >
                  <Text style={{ color: colors.black, fontSize: 18 }}>{note.title}</Text>
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
            <Text style={main.emptyStateText}>There are no notes available.</Text>
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

export default CourseNotes;
