import { connect } from 'react-redux';
import { GetFacultiesByUniversityId } from 'ducks/faculties';

const mapStateToProps = store => {
  return {
    faculties: store.facultiesState.faculties
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getFacultiesByUniversityId: universityId => dispatch(GetFacultiesByUniversityId(universityId))
  };
};

export default com => connect(mapStateToProps, mapDispatchToProps)(com);
