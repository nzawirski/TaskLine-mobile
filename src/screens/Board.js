import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Keyboard,
  Picker
} from "react-native";

import { Button, Input } from "react-native-elements";
import { ThemeProvider } from "react-native-elements";

import Icon from "react-native-vector-icons/FontAwesome";

import { styles, theme } from "../styles";
import TaskItem from "../components/TaskItem";

import { firestore } from "../config";
import moment from "moment";
import "moment/locale/en-gb";
import { ScrollView } from "react-native-gesture-handler";

export default class Board extends Component {
  state = {
    pid: "",
    projectName: "",
    users: [],
    tasks: [],
    loading: true,
    search: "",
    chosenStatus: "pending"
  };

  componentDidMount() {
    //keyboard listeners
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        this.setState({ keyboardIsVisible: true });
      }
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        this.setState({ keyboardIsVisible: false });
      }
    );
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
            status: task.data().Status ? task.data().Status : "pending",
          })
        );
        this.setState({ tasks, loading: false });
      });
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  renderTop = () => {
    if (!this.state.keyboardIsVisible) {
      return (
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 3 }}>
            <Text style={styles.title}>
              Project{" "}
              <Text style={{ color: "mediumpurple" }}>
                {this.state.projectName}
              </Text>
            </Text>
          </View>

          <View style={styles.buttonContainer}>
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
            />
          </View>
        </View>
      );
    }
  };

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
    if (this.state.search != "") {
      taskList = taskList.filter(task => {
        return (
          task.name.toLowerCase().includes(this.state.search.toLowerCase()) &&
          task.status.includes(this.state.chosenStatus)
        );
      });
    } else {
      taskList = taskList.filter(task => {
        return task.status.includes(this.state.chosenStatus);
      });
    }

    return (
      <ThemeProvider theme={theme}>
        <View style={{ flex: 1 }}>
          <ScrollView>
            {this.renderTop()}
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ flex: 2 }}>
                <Input
                  onChangeText={search => this.setState({ search })}
                  selectionColor={"purple"}
                  placeholder={"Find your task..."}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Picker
                  selectedValue={this.state.chosenStatus}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ chosenStatus: itemValue })
                  }
                >
                  <Picker.Item label="Pending" value="pending" />
                  <Picker.Item label="In progress" value="progress" />
                  <Picker.Item label="Completed" value="completed" />
                  <Picker.Item label="Canceled" value="canceled" />
                </Picker>
              </View>
            </View>

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
          </ScrollView>
        </View>
      </ThemeProvider>
    );
  }
}
