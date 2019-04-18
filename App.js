import React, { Component } from "react";
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
  createMaterialTopTabNavigator
} from "react-navigation";

import Home from "./src/screens/Home";
import Taskline from "./src/screens/Taskline";
import Options from "./src/screens/Options";

import Projects from "./src/screens/Projects";
import AddProjectScreen from "./src/screens/AddProjectScreen";

import Board from "./src/screens/Board";
import AddTask from "./src/screens/AddTask";
import ProjectSettings from "./src/screens/ProjectSettings";
import ManageUsers from "./src/screens/ManageUsers";
import TaskScreen from "./src/screens/TaskScreen";

import AuthLoadingScreen from "./src/screens/AuthLoadingScreen";
import Login from "./src/screens/Login";
import SignUp from "./src/screens/SignUp";

console.disableYellowBox = true;

const AuthStack = createStackNavigator(
  {
    Login: Login,
    SignUp: SignUp
  },
  {
    headerMode: "none"
  }
);

const ProjectSettingsStack = createStackNavigator(
  {
    ProjectSettings: ProjectSettings,
    ManageUsers: ManageUsers
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);

const BoardStack = createStackNavigator(
  {
    Board: Board,
    AddTask: AddTask,
    ProjectSettings: ProjectSettingsStack,
    TaskScreen: TaskScreen
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);

const ProjectsStack = createStackNavigator(
  {
    Projects: Projects,
    BoardStack: BoardStack,
    AddProjectScreen: AddProjectScreen
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);

const TasklineStack = createStackNavigator(
  {
    Taskline: Taskline,
    TaskScreen: TaskScreen
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);

const AppNavigator = createMaterialTopTabNavigator(
  {
    Home: Home,
    Projects: ProjectsStack,
    Taskline: TasklineStack,
    Options: Options
  },
  {
    tabBarOptions: {
      activeTintColor: "purple",
      inactiveTintColor: "mediumpurple",
      labelStyle: {
        fontSize: 12
      },
      style: {
        backgroundColor: "#fff"
      },
      indicatorStyle: {
        backgroundColor: "purple"
      }
    }
  }
);

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppNavigator,
      Auth: AuthStack
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}
