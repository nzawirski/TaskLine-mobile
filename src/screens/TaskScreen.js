import React, { Component } from 'react';
import {
  TouchableHighlight,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { styles } from '../styles';
import { CheckBox, Input } from 'react-native-elements'

import { firestore } from '../config';
import { auth } from '../config';
import UserItem from '../components/UserItem'

import moment from 'moment';
import 'moment/locale/en-gb'


export default class TaskScreen extends Component {

  state = {
    taskId: '',
    userSearch: '',
    allUsers: [],
    taskUsers: [],
    projectUsers: [],
    loading: true,
  }

  componentDidMount() {
    //get params from navigation
    const { navigation } = this.props;
    let taskId = navigation.getParam('taskId', null)

    this.setState({ taskId: taskId })
    //get task data from db
    firestore.collection("Tasks").doc(taskId).onSnapshot((doc) => {
      this.setState({
        taskName: doc.data().Name,
        taskDescription: doc.data().Description,
        users: doc.data().Users,
        addedBy: doc.data().AddedBy,
        dateAdded: doc.data().DateAdded,
        dueDate: doc.data().DueDate,
        projectId: doc.data().ProjectId,
        isCompleted: doc.data().isCompleted
      });
      firestore.collection("Projects").doc(doc.data().ProjectId).onSnapshot((doc2) => {
        this.setState({ projectUsers: doc2.data().Users })
      })
    })
    
    // get all users
    firestore.collection("Users").onSnapshot((doc) => {
      let users = [];
      doc.forEach((user) => {
        if (user.id == auth.currentUser.uid) {
          users.push({
            userId: user.id,
            nick: user.data().nick,
            email: user.data().email,
            isSelected: true,
          })
        } else {
          users.push({
            userId: user.id,
            nick: user.data().nick,
            email: user.data().email,
            isSelected: false,
          })
        }
      })
      this.setState({ allUsers: users, loading: false, })
    })

  }

  handleSubmit = () => {

    let idList = []
    this.state.allUsers.forEach((user) => {
      if (user.isSelected) {
        idList.push(user.userId)
      }
    })

    firestore.collection('Tasks').doc(this.state.taskId).set({
      Name: this.state.taskName,
      Description: this.state.taskDescription  ? this.state.taskDescription : "",
      isCompleted: this.state.isCompleted,
      Users: idList,
    }, { merge: true }).then(() => this.props.navigation.goBack())
  }

  selectItem = (uEmail) => {
    let userList = this.state.allUsers;

    userList.forEach((item) => {
      if (uEmail == item.email) {
        item.isSelected = !item.isSelected;
      }
    })

    this.setState({
      allUsers: userList,
    })
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

    userList = this.state.allUsers;
    projectUsers = this.state.projectUsers;

    if (this.state.userSearch != "") {
      userList = userList.filter((user) => {
        return user.isSelected == true || projectUsers.includes(user.userId) && (user.nick.toLowerCase().includes(this.state.userSearch.toLowerCase()) || user.email.toLowerCase().includes(this.state.userSearch.toLowerCase()));
      });
    } else {
      userList = userList.filter((user) => {
        return user.isSelected == true;
      });
    }
    console.log(userList)
    return (
      <View style={{ flex: 1 }}>
        
          <Text style={styles.title}>Task: {this.state.taskName}</Text>
          {/* Task name */}
          <Input
            value={this.state.taskName}
            onChangeText={(taskName) => this.setState({ taskName })}
            label='Name'
          />
          {/* Description */}
          <Input
            value={this.state.taskDescription}
            onChangeText={(taskDescription) => this.setState({ taskDescription })}
            label='Description'
          />
          {/* CheckBox */}
          <CheckBox
            center
            title='Completed'
            checked={this.state.isCompleted}
            onPress={() => this.setState({ isCompleted: !this.state.isCompleted })}
          />

          {/* User Search */}
          <Input
            label="Assign members"
            onChangeText={(userSearch) => this.setState({ userSearch })}
            selectionColor={"purple"}
            placeholder="Search user name or email"
          />
          <View style={{ flex: 1, marginVertical: 5 }}>
            <FlatList
              data={userList}
              renderItem={({ item }) =>
                <UserItem
                  onPress={() => this.selectItem(item.email)}
                  id={item.userId}
                  nick={item.nick}
                  email={item.email}
                  isSelected={item.isSelected}>
                </UserItem>}
            />
          </View>
          {/* Buttons */}
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleSubmit}
            underlayColor={"lavender"}>
            <Text style={styles.buttonText}>Apply changes</Text>
          </TouchableHighlight>


      </View>
    );
  }
}
