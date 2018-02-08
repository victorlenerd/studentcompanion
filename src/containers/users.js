import { connect } from 'react-redux';
import { GetCurrentUser, GetCurrentUserOffline, DeleteCurrentUser } from 'ducks/user';

const mapDispatchToProps = dispatch => {
  return {
    getCurrentUser: () => {
      return dispatch(GetCurrentUser());
    },
    getCurrentUserOffline: () => {
      return dispatch(GetCurrentUserOffline());
    },
    deleteCurrentUser: () => {
      return dispatch(DeleteCurrentUser());
    }
  };
};

const mapStateToProps = store => {
  return {};
};

const Use = Component => connect(mapStateToProps, mapDispatchToProps)(Component);

export default Use;
