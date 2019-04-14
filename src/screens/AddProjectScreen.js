import React, { Component } from 'react';
import {
  View,
  Text,
  Keyboard,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeProvider } from 'react-native-elements';

import { styles, theme } from '../styles';
import { firestore } from '../config';
import { auth } from '../config';
import UserItem from '../components/UserItem'

export default class AddProjectScreen extends Component {

  state = {
    projectName: '',
    userSearch: '',
    allUsers: [],
    chosenUsers: [],
    keyboardIsVisible: false,
    loading: true,
  };

  handleSubmit = () => {
    let idList = []
    this.state.chosenUsers.forEach((user) => {
      idList.push(user.userId)
    })
    firestore.collection("Projects").add({
      Name: this.state.projectName,
      Date: new Date(),
      Users: idList
    }).then(() => this.props.navigation.goBack())
  };

  componentDidMount() {

    //keyboard listeners
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => { this.setState({ keyboardIsVisible: true }) },
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => { this.setState({ keyboardIsVisible: false }) },
    );
    //check logged user
    firestore.collection("Users").doc(auth.currentUser.uid).onSnapshot((doc) => {
      this.setState({
        currentUserId: doc.id,
        currentUserName: doc.data().nick,
        currentUserEmail: doc.data().email,
      });
      //add current user to project members at start
      this.addUser(doc.id, doc.data().nick, doc.data().email)
    })

    //get data about all users
    firestore.collection("Users").onSnapshot((doc) => {
      let users = [];
      doc.forEach((user) => {
        users.push({
          userId: user.id,
          nick: user.data().nick,
          email: user.data().email,
        })
      })
      this.setState({ allUsers: users, loading: false, })
    })
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  renderButtons = () => {
    if (!this.state.keyboardIsVisible) {
      return (
        <View style={styles.buttonContainer}>
          <Button
            buttonStyle={{
              marginHorizontal: 10
            }}
            icon={
              <Icon
                name="window-close"
                size={15}
                color="white"
              />
            }
            onPress={() => this.props.navigation.goBack()}
            title="Dismiss">
          </Button>

          <Button
            buttonStyle={{
              marginHorizontal: 10
            }}
            icon={
              <Icon
                name="check-circle"
                size={15}
                color="white"
              />
            }
            onPress={this.handleSubmit}
            title="Add Project">
          </Button>
        </View>
      )
    }
  }

  addUser = (userId, userName, userEmail) => {
    console.log("trying to add user", userName)
    let idList = []
    this.state.chosenUsers.forEach((user) => {
      idList.push(user.userId)
    })
    if (!idList.includes(userId)) {
      let stateCopy = this.state.chosenUsers
      stateCopy.push({
        userId: userId,
        nick: userName,
        email: userEmail,
      })
      this.setState({chosenUsers: stateCopy})

      console.log(">>>>>>>>>>>>>user " + userName + " added")
    }
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
    let userList = this.state.allUsers;

    userList = userList.filter((user) => {
      return user.nick.toLowerCase().includes(this.state.userSearch.toLowerCase()) || user.email.toLowerCase().includes(this.state.userSearch.toLowerCase());
    });


    return (
      <ThemeProvider theme={theme}>
        <View style={{ flex: 1 }}>

          <Input
            label="Project name"
            onChangeText={(projectName) => this.setState({ projectName })}
            selectionColor={"purple"}
          />

          <Input
            label="Add project members"
            onChangeText={(userSearch) => this.setState({ userSearch })}
            selectionColor={"purple"}
            placeholder={"Search user name or email"}
          />

          <View style={{ flex: 1, marginVertical: 5 }}>
            <FlatList
              data={userList}
              renderItem={({ item }) =>
                <UserItem
                  onPress={() => this.addUser(item.userId, item.nick, item.email)}
                  id={item.userId}
                  nick={item.nick}
                  email={item.email}>
                </UserItem>}
            />
          </View>
          <Text>Selected Users</Text>
          <View style={{ flex: 1, marginVertical: 5 }}>
            <FlatList
              data={this.state.chosenUsers}
              extraData={this.state}
              renderItem={({ item }) =>
                <UserItem
                  id={item.userId}
                  nick={item.nick}
                  email={item.email}>
                </UserItem>}
            />
          </View>

          {this.renderButtons()}
        </View>
      </ThemeProvider>
    );
  }
}


