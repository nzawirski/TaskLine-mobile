import React, { Component } from 'react';
import { TouchableHighlight, View, Text, ScrollView } from 'react-native';
import { styles } from '../styles';

import { firestore } from '../config';

import TaskItem from '../components/TaskItem';

export default class Board extends Component {
  
  state = {
    pid: "",
    projectName: "",
    users: [],
    tasks: []
  }

  componentDidMount(){
    //Get passed params and provide fallback value
    const { navigation } = this.props;
    const projectId = navigation.getParam('projectId', null);

    this.setState({pid: projectId});

    firestore.collection("Projects").doc(projectId).onSnapshot((doc)=>{
      this.setState({ 
        projectName: doc.data().Name,
      });
    })

    firestore.collection("Projects").doc(projectId).onSnapshot((doc)=>{
      this.setState({ users: doc.data().Users});
    })

    firestore.collection("Tasks").where("ProjectId", "==", projectId).orderBy("DateAdded").get().then((doc)=>{
      let tasks=[];
      doc.forEach((task)=>tasks.push([task.id, 
        task.data().Name, 
        task.data().DateAdded, 
        task.data().DueDate, 
        task.data().AddedBy,
        task.data().Users
        ]));
      this.setState({ tasks: tasks })
    }).catch(error => {
      console.error("could not fetch tasks", error);
    })
  }

  render() {

    let userList = [];
    this.state.users.forEach((i)=>{userList.push(<Text>U: {i}</Text>)})

    let taskList = [];
    this.state.tasks.forEach((i)=>{taskList.push(<TaskItem taskName={i[1]} addedBy={i[4]} dateAdded={i[2]}></TaskItem>)})

    return (
      <View style={{flex: 1}}>
      <View style={{flex: 5,}}>
        <Text style={styles.title}>Project {this.state.projectName}</Text>
        {userList}
        <ScrollView>{taskList}</ScrollView>
        
      </View>

        <View style={styles.purple}>
        <TouchableHighlight
          style={styles.button2}
          onPress={() => this.props.navigation.navigate('AddUser', {projectId: this.state.pid})}
          underlayColor={"lavender"}>
          <Text style={styles.buttonText}>Add user</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button2}
          onPress={() => this.props.navigation.navigate('AddTask', {projectId: this.state.pid})}
          underlayColor={"lavender"}>
          <Text style={styles.buttonText}>Add task</Text>
        </TouchableHighlight>
        </View>
      </View>
    );
  }
}