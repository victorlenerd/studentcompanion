import { connect } from 'react-redux';
import { GetComments, PostComments } from 'ducks/comments';

const mapStateToProps = store => {
  return {
    comments: store.commentsState.comments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getComments: () => dispatch(GetComments()),
    postComments: comments => dispatch(PostComments(comments))
  };
};

export default com => connect(mapStateToProps, mapDispatchToProps)(com);
