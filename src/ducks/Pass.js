const ADD_KEY = 'ADD_KEY';
const DELETE_KEY = 'DELETE_KEY';
const CLEAR_KEYS = 'CLEAR_KEYS';

let initialState = {
  pass: '',
};

export const addKey = key => {
  return {
    type: ADD_KEY,
    key,
  };
};

export const deleteKey = () => {
  return {
    type: DELETE_KEY,
  };
};

export const clearKeys = () => {
  return {
    type: CLEAR_KEYS,
  };
};

export const passReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_KEY:
      return Object.assign({}, state, { pass: state.pass.concat(action.key) });
    case DELETE_KEY:
      return Object.assign({}, state, { pass: state.pass.slice(0, state.pass.length - 1) });
    case CLEAR_KEYS:
      return Object.assign({}, state, { pass: '' });
    default:
      break;
  }

  return state;
};
