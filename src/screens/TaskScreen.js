import React, { Component } from 'react';
import { TouchableHighlight, View, Text, ScrollView } from 'react-native';
import { styles } from '../styles';
import { CheckBox, Input } from 'react-native-elements'

import { firestore } from '../config';

import moment from 'moment';
import 'moment/locale/en-gb'

export default class TaskScreen extends Component {

  state = {
    taskId: '',
    users: [],
  }

  componentDidMount() {
    //get params from navigation
    const { navigation } = this.props;
    let taskId = navigation.getParam('taskId', null)

    this.setState({ taskId: taskId })

    //get data from db
    firestore.collection("Tasks").doc(taskId).onSnapshot((doc) => {
      this.setState({
        taskName: doc.data().Name,
        taskDescription: doc.data().Description,
        users: doc.data().Users,
        addedBy: doc.data().AddedBy,
        dateAdded: doc.data().DateAdded,
        dueDate: doc.data().DueDate,
        projectId: doc.data().projectId,
        isCompleted: doc.data().isCompleted
      });
    })

  }

  handleSubmit = () => {
    firestore.collection('Tasks').doc(this.state.taskId).set({
      Name: this.state.taskName,
      Description: this.state.taskDescription,
      isCompleted: this.state.isCompleted
    }, { merge: true });
  }

  render() {

    let userList = [];
    this.state.users.forEach((i) => { userList.push(<Text>U: {i}</Text>) })

    return (
      <View style={{ flex: 1 }}>
        <View >
          <Text style={styles.title}>Task: {this.state.taskName}</Text>
          <Input
            value={this.state.taskName}
            onChangeText={(taskName) => this.setState({ taskName })}
            label='Name'
          />
          <Input
            value={this.state.taskDescription}
            onChangeText={(taskDescription) => this.setState({ taskDescription })}
            label='Description'
          />
          <CheckBox
            center
            title='Completed'
            checked={this.state.isCompleted}
            onPress={() => this.setState({ isCompleted: !this.state.isCompleted })}
          />

          <TouchableHighlight
            style={styles.button}
            onPress={this.handleSubmit}
            underlayColor={"lavender"}>
            <Text style={styles.buttonText}>Apply changes</Text>
          </TouchableHighlight>

        </View>
      </View>
    );
  }
}
