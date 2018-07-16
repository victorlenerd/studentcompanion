import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Text, TextInput, StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';

import { main, colors } from 'shared/styles';

const { width } = Dimensions.get('window');

class CommentForm extends Component {
  state = {
    comment: ''
  };

  submit = () => {
    if (this.state.comment.length < 1) return Alert.alert('Error', 'Comment is too short', [{ text: 'Cancel', style: 'cancel' }]);
    this.props.submitComment(this.state.comment);
    this.setState({ comment: '' });
  }

  renderIsReply() {
    if (this.props.isReply) {
      return (
        <View style={style.isReplyContainer}>
          <View style={{ flex: 0.8 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.accent, marginRight: 15 }}>REPLY TO:</Text>
            <Text style={{ fontSize: 12, color: colors.black }}>{this.props.repliedComment.name}</Text>
          </View>
          <View style={{ flex: 0.2, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <TouchableOpacity
              onPress={this.props.cancelReply}
            >
              <Text style={{ fontSize: 12, color: colors.primary }}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={style.container}>
        {this.renderIsReply()}
        <View style={{ flexDirection: 'row' }}>
          <View style={style.inputContainer}>
            <TextInput
              placeholder="Enter you comment"
              autoCapitalize="none"
              multiline={true}
              underlineColorAndroid="rgba(0, 0, 0, 0)"
              value={this.state.comment}
              style={[main.textInput, style.input]}
              onChange={e => this.setState({ comment: e.nativeEvent.text })}
            />
          </View>
          <View style={style.submitButtonContainer}>
            <TouchableOpacity onPress={this.submit}>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>SEND</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

CommentForm.propTypes = {
  isReply: PropTypes.bool,
  cancelReply: PropTypes.func,
  repliedComment: PropTypes.object,
  submitComment: PropTypes.func
};

const style = StyleSheet.create({
  container: {
    width,
    flexDirection: 'column',
    backgroundColor: colors.white,
    borderTopColor: '#eee',
    borderTopWidth: 1,
  },
  input: {
    height: 60,
    paddingLeft: 10,
    fontSize: 16
  },
  inputContainer: {
    flex: 0.8,
    flexDirection: 'column'
  },
  submitButtonContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendBttn: {
    width: 32,
    height: 32
  },
  isReplyContainer: {
    width,
    height: 50,
    padding: 20,
    borderTopColor: colors.accent,
    borderTopWidth: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.white
  }
});

export default CommentForm;

