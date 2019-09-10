import { connect } from 'react-redux';
import { StartRequest, FinishRequest } from 'ducks/Request';
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
    isConnected: store.isConnectedState.isConnected
  };
};

const Use = Component => connect(mapStateToProps, mapDispatchToProps)(Component);

export default Use;
