
const initalState = {
  menu: true,
  to: null
};

const SET_MENU = 'SET_MENU';

export const setMenu = (menu, to) => ({
  type: SET_MENU,
  menu,
  to
});

export const DrawerIconReducer = (state = initalState, action) => {
  console.log(action, 'action');
  switch (action.type) {
    case SET_MENU:
      return { menu: action.menu, to: action.to };
    default:
      break;
  }

  return state;
};

