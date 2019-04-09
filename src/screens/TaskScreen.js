import React, { Component } from 'react';
import { TouchableHighlight, View, Text, ScrollView } from 'react-native';
import { styles } from '../styles';

import { firestore } from '../config';

import moment from 'moment';
import 'moment/locale/en-gb'

export default class TaskScreen extends Component {

  state = {
    taskId: "",
    taskName: "",
    users: [],
    addedBy: "",
    dateAdded: "",
    dueDate: "",
    projectId: "",
  }

  componentDidMount() {
    //get params from navigation
    const { navigation } = this.props;
    const taskId = navigation.getParam('taskId', null);
    
    this.setState({ taskId: taskId });
    //get data from db
    firestore.collection("Tasks").doc(taskId).onSnapshot((doc) => {
      this.setState({
        taskName: doc.data().Name,
        users: doc.data().Users,
        addedBy: doc.data().AddedBy,
        dateAdded: doc.data().DateAdded,
        dueDate: doc.data().DueDate,
        projectId: doc.data().projectId
      });
    })

  }

  render() {

    let userList = [];
    this.state.users.forEach((i) => { userList.push(<Text>U: {i}</Text>) })

    return (
      <View style={{ flex: 1 }}>
        <View >
          <Text style={styles.title}>Task: {this.state.taskName}</Text>
          <Text>todo: edit and delete</Text>

        </View>
      </View>
    );
  }
}
