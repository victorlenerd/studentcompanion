import { connect } from 'react-redux';
import { GetComments, PostComments } from 'ducks/comments';

const mapStateToProps = store => {
  return {
    comments: store.commentsState.comments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getComments: noteId => dispatch(GetComments('note', noteId)),
    sendComment: comments => dispatch(PostComments(comments))
  };
};

export default com => connect(mapStateToProps, mapDispatchToProps)(com);
