import { connect } from 'react-redux';
import { setMenu } from 'ducks/drawerIcon';

const mapStateToProps = store => {
  const { drawerIconState: { menu, to } } = store;
  return {
    drawerMenu: menu,
    back: to
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setMenu: (menu, to) => dispatch(setMenu(menu, to))
  };
};

export default use => connect(mapStateToProps, mapDispatchToProps)(use);
