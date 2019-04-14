import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles';

import TasklineItem from '../components/TasklineItem';

import { auth, firestore } from '../config';

import moment from 'moment';
import 'moment/locale/en-gb'

export default class Taskline extends Component {
  state = {
    tasks: [],
    swap: false,
  }

  componentDidMount() {
    firestore.collection("Tasks").where("Users", "array-contains", auth.currentUser.uid).orderBy("DueDate", "asc").onSnapshot((doc) => {
      let tasks = [];
      doc.forEach((task) => tasks.push([task.id,
      task.data().Name,
      task.data().DateAdded,
      task.data().DueDate,
      task.data().AddedBy,
      task.data().Description,
      task.data().isCompleted
      ]));
      this.setState({ tasks })
    })
  }

  render() {
    let completedLine = [];
    let activeLine = [];
    let colorCode = "";
    let isNotLate = 0;
    this.state.tasks.forEach((i) => {

      let isCompleted = i[6]

      let today = new Date();
      let dueDate = new Date(i[3].seconds * 1000);

      let fourDays = 1000 * 60 * 60 * 24 * 4
      let month = 1000 * 60 * 60 * 24 * 28

      let dD = moment(dueDate).fromNow();
      let timeUntil = dueDate - today

      let timeNormalisedMonth = Math.round(((timeUntil) / month) * 510);
      let timeNormalisedFourDays = Math.round(((timeUntil) / fourDays) * 510);

      let red
      let green
      let blue

      if (dueDate < today) {
        red = 0
        green = 0
        blue = 0
      } else {
        isNotLate+=1;
        if (timeUntil < fourDays) {
          red = (0 + timeNormalisedFourDays);
          green = 0
          blue = (510 - timeNormalisedFourDays) / 2;
        } else {
          red = (510 - timeNormalisedMonth);
          green = (0 + timeNormalisedMonth);
          blue = 0
        }
      }
      colorCode = "rgb(" + red.toString() + ", " + green.toString() + ", " + blue.toString() + ")";

      if (isCompleted) {
        completedLine.push(<TasklineItem taskName={i[1]} taskDue={dD} taskColor={colorCode}></TasklineItem>);
      } else {
        activeLine.push(<TasklineItem taskName={i[1]} taskDue={dD} taskColor={colorCode} isNotLate={isNotLate}></TasklineItem>);
      }
    })

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 10 }}>
          {this.state.swap ?
            <ScrollView>
              {completedLine}
            </ScrollView> :
            <ScrollView>
              {activeLine}
            </ScrollView>}
        </View>
        <View style={styles.purple}>
          <TouchableOpacity onPress={() => { this.setState({ swap: false }) }} style={styles.button2}><Text>Current</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => { this.setState({ swap: true }) }} style={styles.button2}><Text>Completed</Text></TouchableOpacity>
        </View>
      </View>

    );
  }
}
