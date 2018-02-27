import { connect } from 'react-redux';
import { Search } from 'ducks/search';

const mapStateToProps = store => {
  return { ...store.searchState };
};

const mapDispatchToProps = dispatch => {
  return {
    search: search => dispatch(Search(search)),
  };
};

export default use => connect(mapStateToProps, mapDispatchToProps)(use);
