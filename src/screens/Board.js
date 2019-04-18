import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
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
          tasks.push({
            id: task.id,
            name: task.data().Name,
            dateAdded: task.data().DateAdded,
            dueDate: task.data().DueDate,
            addedBy: task.data().AddedBy,
            users: task.data().Users,
            status: task.data().Status
          })
        );
        this.setState({ tasks, loading: false });
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

    let taskList = this.state.tasks;

    return (
      <ThemeProvider theme={theme}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              Project{" "}
              <Text style={{ color: "mediumpurple" }}>
                {this.state.projectName}
              </Text>
            </Text>
            <Button
              buttonStyle={{
                marginHorizontal: 10
              }}
              icon={<Icon name="edit" size={15} color="white" />}
              onPress={() =>
                this.props.navigation.navigate("ProjectSettings", {
                  projectId: this.state.pid
                })
              }
            />
            <View style={{ flex: 8, marginTop: 10 }}>
              <FlatList
                data={taskList}
                numColumns={2}
                renderItem={({ item }) => (
                  <TaskItem
                    TaskId={item.id}
                    TaskName={item.name}
                    DateAdded={item.dateAdded}
                    DueDate={item.dueDate}
                    AddedBy={item.addedBy}
                    Status={item.status}
                  />
                )}
              />
            </View>
            <View style={styles.buttonContainer}>
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
        </View>
      </ThemeProvider>
    );
  }
}
