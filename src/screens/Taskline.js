import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { styles } from '../styles';

import TasklineItem from '../components/TasklineItem';

import { auth, firestore } from '../config';

import moment from 'moment';
import 'moment/locale/en-gb'

export default class Taskline extends Component {
  state = {
    tasks: [],
    colors: ["#000000", "#ff0000", "#fb2e05", "#f7590a", "#f2810f", "#eea514", "#eac718", "#e6e61d", "#c1e121", "#a0dd25", "#81d929", "#64d42c", "#4ad030",],
  }

  componentDidMount() {
    firestore.collection("Tasks").where("Users", "array-contains", auth.currentUser.uid).orderBy("DueDate", "desc").onSnapshot((doc) => {
      let tasks = [];
      doc.forEach((task) => tasks.push([task.id,
      task.data().Name,
      task.data().DateAdded,
      task.data().DueDate,
      task.data().AddedBy,
      ]));
      this.setState({ tasks })
    })
  }

  render() {
    let taskLine = [];
    let colorNumber = 12;

    this.state.tasks.forEach((i) => { 

      let today = new Date();
      let dueDate = new Date(i[3].seconds * 1000);
      let dD = moment(dueDate).fromNow();

      if(dueDate<today){
        colorNumber=0;
      } else {
        if((dueDate-today)>12096000000){
          colorNumber=12;
        } else if((dueDate-today)>2332800000){
          colorNumber=11;
        } else if((dueDate-today)>2073600000){
          colorNumber=10;
        } else if((dueDate-today)>1555200000){
          colorNumber=9;
        } else if((dueDate-today)>1209600000){
          colorNumber=8;
        } else if((dueDate-today)>864000000){
          colorNumber=7;
        } else if((dueDate-today)>604800000){
          colorNumber=6;
        } else if((dueDate-today)>432000000){
          colorNumber=5;
        } else if((dueDate-today)>259200000){
          colorNumber=4;
        } else if((dueDate-today)>172800000){
          colorNumber=3;
        } else if((dueDate-today)>86400000){
          colorNumber=2;
        } else {
          colorNumber=1;
        }

      }

      taskLine.push(<TasklineItem taskName={i[1]} taskDue={dD} taskColor={this.state.colors[colorNumber]}></TasklineItem>); 
      
    })

    return (
      <View>
        <ScrollView>
          {taskLine}
        </ScrollView>
      </View>
      
    );
  }
}
