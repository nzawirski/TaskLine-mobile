import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StatusBar
} from "react-native";

import { Button } from "react-native-elements";
import { ThemeProvider } from "react-native-elements";

import Icon from "react-native-vector-icons/FontAwesome";

import { styles, theme } from "../styles";
import TaskItem from "../components/TaskItem";

import { firestore } from "../config";
import moment from "moment";
import "moment/locale/en-gb";

export default class Board extends Component {
  state = {
    pid: "",
    projectName: "",
    users: [],
    tasks: [],
    loading: true
  };

  componentDidMount() {
    //Get passed params and provide fallback value
    const { navigation } = this.props;
    const projectId = navigation.getParam("projectId", null);

    this.setState({ pid: projectId });

    firestore
      .collection("Projects")
      .doc(projectId)
      .onSnapshot(doc => {
        this.setState({
          projectName: doc.data().Name,
          users: doc.data().Users
        });
      });

    firestore
      .collection("Tasks")
      .where("ProjectId", "==", projectId)
      .orderBy("DueDate", "desc")
      .onSnapshot(doc => {
        let tasks = [];
        doc.forEach(task =>
          tasks.push([
            task.id,
            task.data().Name,
            task.data().DateAdded,
            task.data().DueDate,
            task.data().AddedBy,
            task.data().Users
          ])
        );
        this.setState({ tasks: tasks, loading: false });
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <View>
          <ActivityIndicator />
          <StatusBar barStyle="default" />
        </View>
      );
    }

    let userList = [];
    this.state.users.forEach(i => {
      userList.push(<Text>U: {i}</Text>);
    });

    let taskList = [];
    this.state.tasks.forEach(i => {
      taskList.push(
        <TaskItem
          TaskId={i[0]}
          TaskName={i[1]}
          DateAdded={i[2]}
          DueDate={i[3]}
          AddedBy={i[4]}
          taskColor={"mediumpurple"}
        />
      );
    });

    return (
      <ThemeProvider theme={theme}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 10 }}>
            <Text style={styles.title}>
              Project{" "}
              <Text style={{ color: "mediumpurple" }}>
                {this.state.projectName}
              </Text>
            </Text>
            {userList}
            <ScrollView
              contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
            >
              {taskList}
            </ScrollView>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              buttonStyle={{
                marginHorizontal: 10
              }}
              icon={<Icon name="user-plus" size={15} color="white" />}
              onPress={() =>
                this.props.navigation.navigate("ManageUsers", {
                  projectId: this.state.pid
                })
              }
              title=" Manage Users"
            />
            <Button
              buttonStyle={{
                marginHorizontal: 10
              }}
              icon={<Icon name="plus-circle" size={15} color="white" />}
              onPress={() =>
                this.props.navigation.navigate("AddTask", {
                  projectId: this.state.pid
                })
              }
              title=" Add Task"
            />
          </View>
        </View>
      </ThemeProvider>
    );
  }
}
