import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions
} from 'react-native';

import { colors } from 'shared/styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

import users from 'containers/users';
import notes from 'containers/notes';
import comments from 'containers/comments';
import connection from 'containers/connection';

import CommentForm from 'components/commentForm';
import CommentListItem from 'components/commentListItem';
import Loader from 'components/loader';
import Tracking from 'shared/tracking';
import EmptyState from 'components/emptyState';

const { height } = Dimensions.get('window');

@notes
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

    Tracking.setCurrentScreen('Page_Comments');

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
      const C = await sendComment(newComment);
      this.setState({
        isReply: false,
        repliedComment: {},
        comments: this.state.comments.concat(C)
      });
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }
  }

  deleteComment = async comment => {
    const { deleteComment } = this.props;

    try {
      await deleteComment(comment);
      this.setState({
        comments: this.state.comments.filter(C => C.$id !== comment.$id)
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
          <ScrollView style={{ flex: 1 }}>
            {this.state.comments.map((comment, index) => {
              return (
                <CommentListItem
                  key={comment.$id}
                  comment={comment}
                  deleteComment={this.deleteComment}
                  setReplyComment={(isReply, repliedComment) => this.setState({ isReply, repliedComment })}
                />
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
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        {this._renderSection()}
        <Loader />
      </KeyboardAvoidingView>
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
