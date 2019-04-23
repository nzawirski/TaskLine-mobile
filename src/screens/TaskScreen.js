import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Keyboard,
  Picker
} from "react-native";

import { Input, Button, Overlay } from "react-native-elements";
import { ThemeProvider } from "react-native-elements";

import Icon from "react-native-vector-icons/FontAwesome";

import { styles, theme } from "../styles";
import UserItem from "../components/UserItem";

import { firestore } from "../config";

import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import "moment/locale/en-gb";

export default class TaskScreen extends Component {
  state = {
    taskId: "",
    userSearch: "",
    allUsers: [],
    taskUsers: [],
    projectUsers: [],
    loading: true,
    isUsersOverlayActive: false,
    isSubtasksOverlayActive: false
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
    //get params from navigation
    const { navigation } = this.props;
    let taskId = navigation.getParam("taskId", null);

    this.setState({ taskId: taskId });
    //get task data from db
    firestore
      .collection("Tasks")
      .doc(taskId)
      .onSnapshot(doc => {
        this.setState({
          taskName: doc.data().Name,
          taskDescription: doc.data().Description,
          users: doc.data().Users,
          addedBy: doc.data().AddedBy,
          dateAdded: doc.data().DateAdded,
          dueDate: doc.data().DueDate.toDate(),
          projectId: doc.data().ProjectId,

          status: doc.data().Status
        });
        firestore
          .collection("Projects")
          .doc(doc.data().ProjectId)
          .onSnapshot(doc2 => {
            this.setState({ projectUsers: doc2.data().Users });
          });
      });

    // get all users
    firestore.collection("Users").onSnapshot(doc => {
      let users = [];
      doc.forEach(user => {
        if (this.state.users.includes(user.id)) {
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

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = date => {
    console.log("A date has been picked: ", date);
    this.setState({
      dueDate: new Date(date)
    });
    this._hideDateTimePicker();
  };

  handleSubmit = () => {
    let idList = [];
    this.state.allUsers.forEach(user => {
      if (user.isSelected) {
        idList.push(user.userId);
      }
    });

    firestore
      .collection("Tasks")
      .doc(this.state.taskId)
      .set(
        {
          Name: this.state.taskName,
          Description: this.state.taskDescription
            ? this.state.taskDescription
            : "",
          Status: this.state.status ? this.state.status : "pending",
          Users: idList,
          DueDate: this.state.dueDate
        },
        { merge: true }
      )
      .then(() => this.props.navigation.goBack());
  };

  selectItem = uEmail => {
    let userList = this.state.allUsers;

    userList.forEach(item => {
      if (uEmail == item.email) {
        item.isSelected = !item.isSelected;
      }
    });

    this.setState({
      allUsers: userList
    });
  };

  renderDateAndStatusPicker = () => {
    if (!this.state.keyboardIsVisible || this.state.isUsersOverlayActive) {
      return (
        /* Due date */
        <View style={{ flex: 1 }}>
          <Text style={{ alignSelf: "center" }}>Due Date:</Text>
          <Text style={{ color: "mediumpurple", alignSelf: "center" }}>
            {moment(this.state.dueDate).format("LLL")}
          </Text>
          <Button
            buttonStyle={{
              margin: 10
            }}
            icon={<Icon name="calendar" size={15} color="white" />}
            onPress={this._showDateTimePicker}
            title=" Select Date"
          />
          <DateTimePicker
            mode={"datetime"}
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
          />

          <Button
            buttonStyle={{
              margin: 10
            }}
            icon={<Icon name="user" size={15} color="white" />}
            onPress={() => this.setState({ isUsersOverlayActive: true })}
            title=" Assign members"
          />

          <Button
            buttonStyle={{
              margin: 10
            }}
            icon={<Icon name="list" size={15} color="white" />}
            onPress={() => this.setState({ isSubtasksOverlayActive: true })}
            title=" Subtasks"
          />

          <Text style={{ alignSelf: "center" }}>Status:</Text>
          <Picker
            selectedValue={this.state.status}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ status: itemValue })
            }
          >
            <Picker.Item label="Pending" value="pending" />
            <Picker.Item label="In progress" value="progress" />
            <Picker.Item label="Completed" value="completed" />
            <Picker.Item label="Canceled" value="canceled" />
          </Picker>
        </View>
      );
    }
  };

  renderButtons = () => {
    if (!this.state.keyboardIsVisible) {
      return (
        <View style={styles.buttonContainer}>
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
      userList = userList.filter(user => {
        return (
          user.isSelected == true ||
          (projectUsers.includes(user.userId) &&
            (user.nick
              .toLowerCase()
              .includes(this.state.userSearch.toLowerCase()) ||
              user.email
                .toLowerCase()
                .includes(this.state.userSearch.toLowerCase())))
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
          {/* Task name */}
          <Input
            value={this.state.taskName}
            onChangeText={taskName => this.setState({ taskName })}
            label="Name"
          />
          {/* Description */}
          <Input
            value={this.state.taskDescription}
            onChangeText={taskDescription => this.setState({ taskDescription })}
            label="Description"
          />
          {/* Date and Status Picker */}
          {this.renderDateAndStatusPicker()}
          {/* User Search */}
          <Overlay
            height={300}
            isVisible={this.state.isUsersOverlayActive}
            onBackdropPress={() =>
              this.setState({ isUsersOverlayActive: false })
            }
          >
            <Input
              label="Assign members"
              onChangeText={userSearch => this.setState({ userSearch })}
              selectionColor={"purple"}
              placeholder="Search user name or email"
            />
            <View style={{ flex: 1, marginVertical: 5 }}>
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
          </Overlay>
          {/*Subtasks Overlay*/}
          <Overlay
            isVisible={this.state.isUsersOverlayActive}
            onBackdropPress={() =>
              this.setState({ isUsersOverlayActive: false })
            }
          ></Overlay>
          {/* Buttons */}
          {this.renderButtons()}
        </View>
      </ThemeProvider>
    );
  }
}
