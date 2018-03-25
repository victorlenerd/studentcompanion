import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { colors } from 'shared/styles';
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

import moment from 'moment';

class ExtractedNoteItem extends Component {
  componentWillMount() {
    moment.updateLocale('en', {
      relativeTime: {
        future: 'in %s',
        past: '%s AGO',
        s: 'A FEW SECS',
        ss: '%d SECS',
        m: 'a MIN',
        mm: '%d MINS',
        h: 'AN HOUR',
        hh: '%d HOURS',
        d: 'A DAY',
        dd: '%d DAYS',
        M: 'A MONTHS',
        MM: '%d MONTHS',
        y: 'A YEAR',
        yy: '%d YEARS',
      },
    });
  }

  render() {
    const { openItem, note } = this.props;
    return (
      <TouchableOpacity onPress={openItem} style={styles.item}>
        <Text style={styles.title}>{note.title || note.body.substring(0, 20)}</Text>
        <Text style={styles.time}>{moment(note.time).fromNow()}</Text>
      </TouchableOpacity>
    );
  }
}

ExtractedNoteItem.propTypes = {
  openItem: PropTypes.func,
  note: PropTypes.object
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.white,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 1
  },
  title: {
    fontSize: 18,
    marginBottom: 5,
    color: colors.black
  },
  time: {
    fontSize: 12,
    color: colors.gray
  }
});

export default ExtractedNoteItem;
