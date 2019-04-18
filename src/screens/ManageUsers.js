import React, { Component } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Keyboard
} from "react-native";

import { Button, Input } from "react-native-elements";
import { ThemeProvider } from "react-native-elements";

import Icon from "react-native-vector-icons/FontAwesome";

import { styles, theme } from "../styles";
import UserItem from "../components/UserItem";

import { auth, firestore } from "../config";

export default class AddUser extends Component {
  state = {
    userSearch: "",
    allUsers: [],
    projectUsers: [],
    loading: true
  };

  componentDidMount() {
    //keyboard listeners
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        this.setState({ keyboardIsVisible: true });
      }
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        this.setState({ keyboardIsVisible: false });
      }
    );

    const { navigation } = this.props;
    const projectId = navigation.getParam("projectId", null);
    //get ids of project users
    firestore
      .collection("Projects")
      .doc(projectId)
      .onSnapshot(doc2 => {
        this.setState({ projectUsers: doc2.data().Users });
      });
    //get data about all users
    firestore.collection("Users").onSnapshot(doc => {
      let users = [];
      doc.forEach(user => {
        if (this.state.projectUsers.includes(user.id)) {
          users.push({
            userId: user.id,
            nick: user.data().nick,
            email: user.data().email,
            isSelected: true
          });
        } else {
          users.push({
            userId: user.id,
            nick: user.data().nick,
            email: user.data().email,
            isSelected: false
          });
        }
      });
      this.setState({ allUsers: users, loading: false });
    });
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
            icon={<Icon name="window-close" size={15} color="white" />}
            onPress={() => this.props.navigation.goBack()}
            title=" Dismiss"
          />

          <Button
            buttonStyle={{
              marginHorizontal: 10
            }}
            icon={<Icon name="check-circle" size={15} color="white" />}
            onPress={this.handleSubmit}
            title=" Apply"
          />
        </View>
      );
    }
  };

  handleSubmit = () => {
    const { navigation } = this.props;
    const projectId = navigation.getParam("projectId", null);

    let idList = [];
    this.state.allUsers.forEach(user => {
      if (user.isSelected) {
        idList.push(user.userId);
      }
    });

    firestore
      .collection("Projects")
      .doc(projectId)
      .update({
        Users: idList
      })
      .then(() => this.props.navigation.goBack());
  };

  selectItem = uEmail => {
    let userList = this.state.allUsers;

    userList.forEach(item => {
      if (uEmail == item.email) {
        if (item.userId != auth.currentUser.uid) {
          item.isSelected = !item.isSelected;
        }
      }
    });

    this.setState({
      allUsers: userList
    });
  };

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
    if (this.state.userSearch != "") {
      userList = userList.filter(user => {
        return (
          user.isSelected == true ||
          user.nick
            .toLowerCase()
            .includes(this.state.userSearch.toLowerCase()) ||
          user.email.toLowerCase().includes(this.state.userSearch.toLowerCase())
        );
      });
    } else {
      userList = userList.filter(user => {
        return user.isSelected == true;
      });
    }

    return (
      <ThemeProvider theme={theme}>
        <View style={{ flex: 1 }}>
          <Input
            label="User Search"
            onChangeText={userSearch => this.setState({ userSearch })}
            inputStyle={{ color: "#89939B" }}
            selectionColor={"purple"}
          />
          <View style={{ flex: 6, marginVertical: 5 }}>
            <FlatList
              data={userList}
              renderItem={({ item }) => (
                <UserItem
                  onPress={() => this.selectItem(item.email)}
                  id={item.userId}
                  nick={item.nick}
                  email={item.email}
                  isSelected={item.isSelected}
                />
              )}
            />
          </View>
          {this.renderButtons()}
        </View>
      </ThemeProvider>
    );
  }
}
