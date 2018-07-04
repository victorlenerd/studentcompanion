import { connect } from 'react-redux';
import {
  GetCurrentUser,
  GetCurrentUserOffline,
  DeleteCurrentUser,
  SignOut,
  SetCurrentUserOffline,
  SendDeviceActivationCode,
  SetAcademicInfo,
  SendEmailVerificationCode,
  SendFeedback,
  UpdateLibrary
} from 'ducks/user';

const mapDispatchToProps = dispatch => {
  return {
    setCurrentUser: user => dispatch(SetCurrentUserOffline(user)),
    getCurrentUser: () => dispatch(GetCurrentUser()),
    setAcademicInfo: (id, data) => dispatch(SetAcademicInfo(id, data)),
    getCurrentUserOffline: () => dispatch(GetCurrentUserOffline()),
    deleteCurrentUser: () => dispatch(DeleteCurrentUser()),
    sendDeviceActivationCode: (email, $id, name) => dispatch(SendDeviceActivationCode(email, $id, name)),
    sendEmailVerificationCode: (email, $id, name) => dispatch(SendEmailVerificationCode(email, $id, name)),
    sendFeedback: (userId, name, email, message) => dispatch(SendFeedback(userId, name, email, message)),
    updateLibrary: (userId, courses) => dispatch(UpdateLibrary(userId, courses)),
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
