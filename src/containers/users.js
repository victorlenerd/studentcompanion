import { connect } from 'react-redux';
import {
  GetCurrentUser,
  GetCurrentUserOffline,
  DeleteCurrentUser,
  SignOut,
  SetCurrentUserOffline,
  SendDeviceActivationCode,
  SetAcademicInfo,
  SendEmailVerificationCode
} from 'ducks/user';
import { SendFeedback } from 'ducks/feedback';

const mapDispatchToProps = dispatch => {
  return {
    setCurrentUser: user => dispatch(SetCurrentUserOffline(user)),
    getCurrentUser: () => dispatch(GetCurrentUser()),
    setAcademicInfo: (id, data) => dispatch(SetAcademicInfo(id, data)),
    getCurrentUserOffline: () => dispatch(GetCurrentUserOffline()),
    deleteCurrentUser: () => dispatch(DeleteCurrentUser()),
    sendDeviceActivationCode: (email, $id, name) => dispatch(SendDeviceActivationCode(email, $id, name)),
    sendEmailVerificationCode: (email, $id, name) => dispatch(SendEmailVerificationCode(email, $id, name)),
    sendFeedback: (userId, message) => dispatch(SendFeedback(userId, message)),
    signOut: () => dispatch(SignOut())
  };
};

const mapStateToProps = store => {
  return {
    currentUser: store.userState.currentUser
  };
};

const Use = Component => connect(mapStateToProps, mapDispatchToProps)(Component);

export default Use;
