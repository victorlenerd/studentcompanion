import { connect } from 'react-redux';
import { SetFaculties, GetFaculties, GetFacultiesByUniversityId } from 'ducks/faculties';

const mapStateToProps = store => {
  return {
    faculties: store.facultiesState.faculties
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setFaculties: faculties => dispatch(SetFaculties(faculties)),
    getFaculties: () => dispatch(GetFaculties()),
    getFacultiesByUniversityId: universityId => dispatch(GetFacultiesByUniversityId(universityId))
  };
};

export default com => connect(mapStateToProps, mapDispatchToProps)(com);
