import { connect } from 'react-redux';
import { GetLevelsByDepartmentId, GetLevels, SetLevels } from 'ducks/levels';

const mapStateToProps = store => {
  return { levels: store.levelsState.levels };
};

const mapDispatchToProps = dispatch => {
  return {
    setLevels: levels => dispatch(SetLevels(levels)),
    getLevels: () => dispatch(GetLevels()),
    getLevelsByDepartmentId: departmentId => dispatch(GetLevelsByDepartmentId(departmentId))
  };
};

export default com => connect(mapStateToProps, mapDispatchToProps)(com);
