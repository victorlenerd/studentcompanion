import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

import { colors } from 'shared/styles';
import capitalize from 'lodash/capitalize';

class UploadListItem extends Component {
  render() {
    const { photoNote } = this.props;

    return (
      <TouchableOpacity
        onPress={() => { this.props.setCurrent(photoNote); }}
        style={style.container}
      >
        <View style={style.inner}>
          <View>
            <Text style={style.type}>{photoNote.type}</Text>
          </View>
          <View>
            <Text style={style.listInfo}>{capitalize(photoNote.faculty)} - {capitalize(photoNote.department)}</Text>
          </View>
          <View>
            <Text style={style.listInfo}>{capitalize(photoNote.courseCode)} - {capitalize(photoNote.courseName)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 2,
    backgroundColor: colors.white,
    flexDirection: 'row'
  },
  inner: {
    flex: 0.8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 10,
    flexDirection: 'column',
    paddingLeft: 20,
  },
  type: {
    fontSize: 20,
    color: '#000'
  },
  listInfo: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: '200',
    color: '#000'
  }
});

UploadListItem.propTypes = {
  setCurrent: PropTypes.func,
  photoNote: PropTypes.object
};

export default UploadListItem;
