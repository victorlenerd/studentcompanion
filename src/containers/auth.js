import { connect } from 'react-redux';
import { Login, Register, SendResetPasswordEmail, UpdateUserDeviceId } from 'ducks/user';

const mapStateToProps = store => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    validEmail: email => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email),
    validPhone: phoneNumber => /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(phoneNumber),
    login: ({ email, password }) => dispatch(Login({ email, password })),
    register: ({ name, email, phone, password }) => dispatch(Register({ name, email, phone, password })),
    sendPasswordReset: email => dispatch(SendResetPasswordEmail(email)),
    updateDeviceId: code => dispatch(UpdateUserDeviceId(code))
  };
};

export default component => connect(mapStateToProps, mapDispatchToProps)(component);
