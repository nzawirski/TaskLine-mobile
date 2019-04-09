import React, { Component } from 'react';
import { createSwitchNavigator, createStackNavigator, createAppContainer, createMaterialTopTabNavigator } from 'react-navigation';

import Home from './src/screens/Home';
import Projects from './src/screens/Projects';
import Taskline from './src/screens/Taskline';
import Options from './src/screens/Options';

import Board from './src/screens/Board';
import AddProjectScreen from './src/screens/AddProjectScreen';
import AddTask from './src/screens/AddTask';
import AddUser from './src/screens/AddUser';
import TaskScreen from './src/screens/TaskScreen';

import AuthLoadingScreen from './src/screens/AuthLoadingScreen';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';

console.disableYellowBox = true;

const AuthStack = createStackNavigator({
  Login: Login,
  SignUp: SignUp,
}, {
  headerMode: 'none',
});

const BoardStack = createStackNavigator({
  Board: Board,
  AddTask: AddTask,
  AddUser: AddUser,
  TaskScreen: TaskScreen
}, {
  mode: 'modal',
  headerMode: 'none',
})

const ProjectsStack = createStackNavigator({
  Projects: Projects,
  BoardStack: BoardStack,
  AddProjectScreen: AddProjectScreen,
}, {
  mode: 'modal',
  headerMode: 'none',
})

const AppNavigator = createMaterialTopTabNavigator({
  Home: Home,
  Projects: ProjectsStack,
  Taskline: Taskline,
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
