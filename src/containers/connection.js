import { connect } from 'react-redux';
import { StartRequest, FinishRequest } from 'ducks/request';
import { SetIsConnected } from 'ducks/connection';

const mapDispatchToProps = dispatch => {
  return {
    startRequest: () => {
      dispatch(StartRequest());
    },
    finishRequest: () => {
      dispatch(FinishRequest());
    },
    setConnection: isConnected => {
      dispatch(SetIsConnected(isConnected));
    }
  };
};

const mapStateToProps = store => {
  return {
    isLoading: store.requestState.status,
  };
};

const Use = Component => connect(mapStateToProps, mapDispatchToProps)(Component);

export default Use;
