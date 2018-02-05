import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';



const App = StackNavigator({
    Welcome: {

    }
});

AppRegistry.registerComponent('StudentCompanion', () => App);