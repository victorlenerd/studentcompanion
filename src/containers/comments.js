import { connect } from 'react-redux';
import { GetComments, PostComments, DeleteComment } from 'ducks/Comments';

const mapStateToProps = store => {
  return {
    comments: store.commentsState.comments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getComments: noteId => dispatch(GetComments('note', noteId)),
    deleteComment: comment => dispatch(DeleteComment(comment)),
    sendComment: comments => dispatch(PostComments(comments))
  };
};

export default com => connect(mapStateToProps, mapDispatchToProps)(com);
