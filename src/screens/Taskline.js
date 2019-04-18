import React, { Component } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  StatusBar
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
    loading: true
  };

  componentDidMount() {
    firestore
      .collection("Tasks")
      .where("Users", "array-contains", auth.currentUser.uid)
      .orderBy("DueDate", "asc")
      .onSnapshot(doc => {
        let tasks = [];
        doc.forEach(task =>
          tasks.push([
            task.id,
            task.data().Name,
            task.data().DateAdded,
            task.data().DueDate,
            task.data().AddedBy,
            task.data().Description,
            task.data().Status,
          ])
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

    let completedLine = [];
    let activeLine = [];
    let colorCode = "";
    let isNotLate = 0;
    this.state.tasks.forEach(i => {
      let status = i[6];

      let today = new Date();
      let dueDate = new Date(i[3].seconds * 1000);

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
        isNotLate += 1;
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

      if (status=="completed") {
        completedLine.push(
          <TasklineItem
            taskId={i[0]}
            taskName={i[1]}
            taskDue={dD}
            taskColor={colorCode}
          />
        );
      } else {
        activeLine.push(
          <TasklineItem
            taskId={i[0]}
            taskName={i[1]}
            taskDue={dD}
            taskColor={colorCode}
            isNotLate={isNotLate}
          />
        );
      }
    });

    return (
      <ThemeProvider theme={theme}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 10 }}>
            {this.state.swap ? (
              <ScrollView>{completedLine}</ScrollView>
            ) : (
              <ScrollView>{activeLine}</ScrollView>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              buttonStyle={{
                marginHorizontal: 10
              }}
              icon={<Icon name="file" size={15} color="white" />}
              onPress={() => {
                this.setState({ swap: false });
              }}
              title=" Current"
            />
            <Button
              buttonStyle={{
                marginHorizontal: 10
              }}
              icon={<Icon name="archive" size={15} color="white" />}
              onPress={() => {
                this.setState({ swap: true });
              }}
              title=" Completed"
            />
          </View>
        </View>
      </ThemeProvider>
    );
  }
}
