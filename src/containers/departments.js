import { connect } from 'react-redux';
import { GetDepartmentsByFacultyId } from 'ducks/departments';

const mapStateToProps = store => {
  return {
    departments: store.departmentsState.departments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getDepartmentsByFacultyId: facultyId => dispatch(GetDepartmentsByFacultyId(facultyId))
  };
};

export default com => connect(mapStateToProps, mapDispatchToProps)(com);
