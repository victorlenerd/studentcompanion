import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import notes from 'containers/notes';

import { main, colors } from 'shared/styles';

@notes
class ChooseNotes extends Component {
  _openNote = note => {
    const { navigation: { navigate }, setCurrentNote } = this.props;
    setCurrentNote(note);
    navigate('Note');
  }

  _renderSection() {
    const { notes } = this.props;
    if (notes.length > 0) {
      return (
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            {notes.map((note, index) => {
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
