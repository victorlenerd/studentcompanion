import { connect } from 'react-redux';
import { SetDepartments, GetDepartments, GetDepartmentsByFacultyId } from 'ducks/departments';

const mapStateToProps = store => {
  return {
    departments: store.departmentsState.departments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setDepartments: data => dispatch(SetDepartments(data)),
    getDepartments: () => dispatch(GetDepartments()),
    getDepartmentsByFacultyId: facultyId => dispatch(GetDepartmentsByFacultyId(facultyId))
  };
};

export default com => connect(mapStateToProps, mapDispatchToProps)(com);
