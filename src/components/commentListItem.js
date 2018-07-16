import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import moment from 'moment';
import users from 'containers/users';
import { colors } from 'shared/styles';

@users
class CommentListItem extends Component {
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

  renderReplied = comment => {
    if (comment.isReply) {
      return (
        <View style={style.isRepliedContainer}>
          <Text style={style.replyTxt}>
            REPLY TO:
          </Text>
          <Text style={style.commentReply}>
            {comment.repliedComment.name}
          </Text>
          <Text numberOfLines={2} ellipsizeMode="middle" style={style.commentReplyTo}>
            {comment.repliedComment.comment}
          </Text>
        </View>
      );
    }
  };

  render() {
    const { comment, currentUser: { $id: userId } } = this.props;

    return (
      <View style={{ flex: 1, marginBottom: 1, padding: 20, backgroundColor: colors.white }}>
        {this.renderReplied(comment)}
        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
          <Text style={{ fontSize: 12, marginBottom: 10, color: colors.black }}>{comment.name}</Text>
          <Text style={{ fontSize: 12, color: colors.gray }}>{moment(comment.dateAdded).fromNow()}</Text>
        </View>

        <Text style={{ fontSize: 16, color: colors.black }}>{comment.comment}</Text>
        <View
          style={{
            flex: 1,
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {comment.userId !== userId &&
            <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.setReplyComment(true, comment);
                }}
              >
                <Text style={{ fontSize: 12, color: colors.primary }}>REPLY</Text>
              </TouchableOpacity>
            </View>}

          {comment.userId === userId &&
            <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.deleteComment(comment);
                }}
              >
                <Text style={{ fontSize: 12, color: colors.primary }}>DELETE</Text>
              </TouchableOpacity>
            </View>}
        </View>
      </View>
    );
  }
}

CommentListItem.propTypes = {
  comment: PropTypes.object,
  setReplyComment: PropTypes.func
};

const style = StyleSheet.create({
  isRepliedContainer: {
    marginBottom: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
  },
  replyTxt: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.accent,
    marginRight: 15,
    marginTop: 5,
  },
  commentReply: {
    fontSize: 12,
    color: colors.black,
    marginBottom: 5,
    marginTop: 5
  },
  commentReplyTo: {
    fontSize: 16,
    color: colors.black,
    marginBottom: 5
  }
});

export default CommentListItem;
