import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Alert,
  StyleSheet
} from 'react-native';

import { colors } from 'shared/styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

import users from 'containers/users';
import papers from 'containers/papers';
import notes from 'containers/notes';
import comments from 'containers/comments';
import connection from 'containers/connection';

import CommentForm from 'components/commentForm';
import CommentListItem from 'components/commentListItem';
import Loader from 'components/loader';

import EmptyState from 'components/emptyState';

@notes
@papers
@users
@connection
@comments
class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReply: false,
      repliedComment: {},
      comments: [],
    };
  }

  async componentWillMount() {
    const { getComments, currentNote: { $id: noteId } } = this.props;
    try {
      const noteComments = await getComments(noteId);
      this.setState({ comments: noteComments });
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
  }

  _submitComment = async comment => {
    const { sendComment, currentUser: { $id: userId, name }, currentNote: { $id: noteId } } = this.props;

    const newComment = {
      comment: comment,
      userId: userId,
      name: name,
      type: 'note',
      noteId: noteId,
      isReply: this.state.isReply,
      repliedComment: this.state.repliedComment,
      dateAdded: new Date().toISOString()
    };

    try {
      await sendComment(newComment);
      this.setState({
        isReply: false,
        repliedComment: {},
      });
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
  }

  _renderSection() {
    if (!this.props.isConnected) {
      return (<EmptyState message="You Are Offline!" />);
    }

    return (
      <View style={style.container}>
        <View style={{ flex: 1 }}>
          <ScrollView style={{ padding: 20 }}>
            {this.state.comments.map((comment, index) => {
              return (
                <CommentListItem comment={comment} setReplyComment={(isReply, repliedComment) => this.setState({ isReply, repliedComment })} />
              );
            })}
          </ScrollView>
        </View>
        <CommentForm submitComment={this._submitComment} isReply={this.state.isReply} repliedComment={this.state.repliedComment} cancelReply={() => this.setState({ isReply: false })} />
      </View>
    );
  }

  render() {
    return (
      <KeyboardAwareScrollView>
        {this._renderSection()}
        <Loader />
      </KeyboardAwareScrollView>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.lightBlue,
    borderTopColor: colors.accent,
    borderTopWidth: 2
  }
});

export default Comments;
