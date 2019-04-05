import React, { Component } from 'react';
import { createSwitchNavigator, createStackNavigator, createAppContainer, createMaterialTopTabNavigator } from 'react-navigation';

import Home from './src/screens/Home';
import Projects from './src/screens/Projects';
import Timeline from './src/screens/Timeline';
import Options from './src/screens/Options';

import AddProjectScreen from './src/screens/AddProjectScreen';

import AuthLoadingScreen from './src/screens/AuthLoadingScreen';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';

const AuthStack = createStackNavigator({
  Login: Login,
  SignUp: SignUp,
}, {
  headerMode: 'none',
});


const ProjectsStack = createStackNavigator({
  Projects: Projects,
  AddProjectScreen: AddProjectScreen
}, {
  mode: 'modal',
  headerMode: 'none',
})

const AppNavigator = createMaterialTopTabNavigator({
  Home: Home,
  Projects: ProjectsStack,
  Timeline: Timeline,
  Options: Options
}, {
    tabBarOptions: {
      activeTintColor: 'purple',
      inactiveTintColor: 'mediumpurple',
      labelStyle: {
        fontSize: 12,
      },
      style: {
        backgroundColor: '#fff',
      },
      indicatorStyle: {
        backgroundColor: 'purple',
      },
    }
  });

const AppContainer = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppNavigator,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}
