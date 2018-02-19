import { connect } from 'react-redux';
import { GetUniversities, SetUniversities } from 'ducks/universities';

const mapStateToProps = store => {
  return {
    universities: store.universitiesState.universities
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUniversities: universities => dispatch(SetUniversities(universities)),
    getUniversities: () => dispatch(GetUniversities())
  };
};

export default com => connect(mapStateToProps, mapDispatchToProps)(com);
