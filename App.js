import React, { Component } from 'react';
import { createStackNavigator, createAppContainer, createMaterialTopTabNavigator } from 'react-navigation';
import Home from './src/screens/Home';

// we will use these two screens later in our AppNavigator
import Projects from './src/screens/Projects';
import SignUp from './src/screens/SignUp';
import Timeline from './src/screens/Timeline';
import Options from './src/screens/Options';

const AppNavigator = createMaterialTopTabNavigator({
    Home: Home,
    Projects: Projects,
    SignUp: SignUp,
    Timeline: Timeline,
    Options: Options
},{
    tabBarOptions: {
        activeTintColor: '#000',
        inactiveTintColor: 'gray',
        labelStyle: {
          fontSize: 12,
        },
        style: {
            backgroundColor: '#fff',
        },
        indicatorStyle: {
            backgroundColor: '#000',
        },
    }
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}
