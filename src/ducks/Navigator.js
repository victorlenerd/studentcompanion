const NAVIGATOR_OPEN = 'NAVIGATOR_OPEN';
const NAVIGATOR_PUSH = 'NAVIGATOR_PUSH';

let initialState = {
  currentScreen: null,
  previousScreen: null,
  props: null,
};

export const Open = (screen, props = {}) => {
  return {
    type: NAVIGATOR_OPEN,
    screen,
    props,
  };
};

export const Push = (screen, props = {}) => {
  return {
    type: NAVIGATOR_PUSH,
    screen,
    props,
  };
};

export const NavigatorReducer = (state = initialState, action) => {
  switch (action.type) {
    case NAVIGATOR_OPEN:
      return Object.assign({}, state, {
        currentScreen: action.currentScreen,
        previousScreen: state.previousScreen,
        props: action.props,
      });
    case NAVIGATOR_PUSH:
      return Object.assign({}, state, {
        currentScreen: action.currentScreen,
        previousScreen: state.previousScreen,
        props: action.props,
      });
    default:
      break;
  }

  return state;
};
