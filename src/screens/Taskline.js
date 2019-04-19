import React, { Component } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Picker
} from "react-native";

import { Button } from "react-native-elements";
import { ThemeProvider } from "react-native-elements";

import Icon from "react-native-vector-icons/FontAwesome";

import { styles, theme } from "../styles";
import TasklineItem from "../components/TasklineItem";

import { auth, firestore } from "../config";

import moment from "moment";
import "moment/locale/en-gb";

export default class Taskline extends Component {
  state = {
    tasks: [],
    swap: false,
    loading: true,
    chosenStatus: "all"
  };

  componentDidMount() {
    firestore
      .collection("Tasks")
      .where("Users", "array-contains", auth.currentUser.uid)
      .orderBy("DueDate", "asc")
      .onSnapshot(doc => {
        let tasks = [];
        let colorCode = "";

        doc.forEach(task => {
          let today = new Date();
          let dueDate = new Date(task.data().DueDate.seconds * 1000);

          let fourDays = 1000 * 60 * 60 * 24 * 4;
          let month = 1000 * 60 * 60 * 24 * 28;

          let dD = moment(dueDate).fromNow();
          let timeUntil = dueDate - today;

          let timeNormalisedMonth = Math.round((timeUntil / month) * 510);
          let timeNormalisedFourDays = Math.round((timeUntil / fourDays) * 510);

          let red;
          let green;
          let blue;

          if (dueDate < today) {
            red = 0;
            green = 0;
            blue = 0;
          } else {
            if (timeUntil < fourDays) {
              red = 510 - timeNormalisedFourDays;
              green = 0;
              blue = (0 + timeNormalisedFourDays) / 2;
            } else {
              red = 0;
              green = 0 + timeNormalisedMonth;
              blue = 510 - timeNormalisedMonth;
            }
          }

          colorCode =
            "rgb(" +
            red.toString() +
            ", " +
            green.toString() +
            ", " +
            blue.toString() +
            ")";

          tasks.push({
            id: task.id,
            name: task.data().Name,
            dateAdded: task.data().DateAdded,
            dueDate: dD,
            color: colorCode,
            status: task.data().Status ? task.data().Status : "pending"
          });
        });
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
    if (this.state.chosenStatus != "all") {
      taskList = taskList.filter(task=>{
        return(task.status.includes(this.state.chosenStatus));
      })
    }

    return (
      <ThemeProvider theme={theme}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Picker
              selectedValue={this.state.chosenStatus}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ chosenStatus: itemValue })
              }
            >
              <Picker.Item label="All" value="all" />
              <Picker.Item label="Pending" value="pending" />
              <Picker.Item label="In progress" value="progress" />
              <Picker.Item label="Completed" value="completed" />
              <Picker.Item label="Canceled" value="canceled" />
            </Picker>
          </View>
          <View style={{ flex: 9 }}>
            <FlatList
              data={taskList}
              extraData={this.state}
              renderItem={({ item }) => (
                <TasklineItem
                  taskId={item.id}
                  taskName={item.name}
                  taskDue={item.dueDate}
                  taskColor={item.color}
                />
              )}
            />
          </View>
        </View>
      </ThemeProvider>
    );
  }
}
