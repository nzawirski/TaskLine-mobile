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
      ]));
      this.setState({ tasks })
    })
  }

  render() {
    let oldTaskLine = [];
    let goodTaskLine = [];
    let colorCode = "";

    this.state.tasks.forEach((i) => { 

      let today = new Date();
      let dueDate = new Date(i[3].seconds * 1000);
      let dD = moment(dueDate).fromNow();
      let dT = Math.round(((dueDate-today)/100000/24192)*510);
      let red = (510-dT) > 255 ? red = 255 : red = (510-dT);
      let green = (0+dT) > 255 ? green = 255 : green = (0+dT);

      if(dueDate<today){
        colorCode="rgb(0, 0, 0)";
        oldTaskLine.push(<TasklineItem taskName={i[1]} taskDue={dD} taskColor={colorCode}></TasklineItem>); 
      } else {
       colorCode="rgb("+red.toString()+", "+green.toString()+", 0)";
       goodTaskLine.push(<TasklineItem taskName={i[1]} taskDue={dD} taskColor={colorCode}></TasklineItem>); 
      } 
    })

    return (
      <View style={{flex: 1}}>
        <View style={{flex: 10}}>
        {this.state.swap ?
          <ScrollView>
            {oldTaskLine}
          </ScrollView> : 
          <ScrollView>
            {goodTaskLine}
          </ScrollView>}
        </View>
        <View style={styles.purple}>
          <TouchableOpacity onPress={()=>{this.setState({swap:false})}} style={styles.button2}><Text>Current</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.setState({swap:true})}} style={styles.button2}><Text>Completed</Text></TouchableOpacity>
        </View>
      </View>
      
    );
  }
}
