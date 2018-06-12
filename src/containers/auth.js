import { connect } from 'react-redux';
import {
  Login,
  Register,
  SendResetPasswordEmail,
  UpdateUserDeviceId,
  UserExist,
  UpdateEmailVerification
} from 'ducks/user';

const mapStateToProps = store => {
  return {
    currentUser: store.userState.currentUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    validEmail: email => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email),
    validPhone: phoneNumber => /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(phoneNumber),
    login: ({ email, password }) => dispatch(Login({ email, password })),
    register: ({ name, email, phoneNumber, password }) => dispatch(Register({ name, email, phoneNumber, password })),
    sendPasswordReset: email => dispatch(SendResetPasswordEmail(email)),
    userExist: email => dispatch(UserExist(email)),
    updateDeviceId: code => dispatch(UpdateUserDeviceId(code)),
    updateEmailVerification: code => dispatch(UpdateEmailVerification(code))
  };
};

export default component => connect(mapStateToProps, mapDispatchToProps)(component);
