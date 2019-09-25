import { StackActions, NavigationActions } from 'react-navigation';


const resetToWelcome = (navigation, route = 'Welcome') => {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: route })],
  });
  return navigation.dispatch(resetAction);
};

export default resetToWelcome;

