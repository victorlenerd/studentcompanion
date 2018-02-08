const START_REQUEST = 'START_REQUEST';
const FINISH_REQUEST = 'FINISH_REQUEST';

const initialState = {
  status: false,
};

export const StartRequest = key => {
  return {
    type: START_REQUEST,
  };
};

export const FinishRequest = key => {
  return {
    type: FINISH_REQUEST,
  };
};

export const RequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_REQUEST:
      return { status: true };
    case FINISH_REQUEST:
      return { status: false };
    default:
      return state;
  }
};
