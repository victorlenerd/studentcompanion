const SET_IS_CONNECTED = 'SET_IS_CONNECTED';

const initialState = {
  isConnected: false,
};

export const SetIsConnected = isConnected => {
  return {
    type: SET_IS_CONNECTED,
    isConnected,
  };
};

export const IsConnectedReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_CONNECTED:
      return { isConnected: action.isConnected };
    default:
      return state;
  }
};
