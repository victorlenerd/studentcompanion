import { connect } from 'react-redux';
import { GetLevelsByDepartmentId } from 'ducks/levels';

const mapStateToProps = store => {
  return { levels: store.levelsState.levels };
};

const mapDispatchToProps = dispatch => {
  return {
    getLevelsByDepartmentId: departmentId => dispatch(GetLevelsByDepartmentId(departmentId))
  };
};

export default com => connect(mapStateToProps, mapDispatchToProps)(com);
