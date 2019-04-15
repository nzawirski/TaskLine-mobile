import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  Keyboard,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import 'moment/locale/en-gb'

import { styles } from '../styles';
import { firestore } from '../config';
import { auth } from '../config';

import UserItem from '../components/UserItem'


export default class AddTask extends Component {
  state = {
    taskName: '',
    userSearch: "",
    dueDate: new Date(),
    isDateTimePickerVisible: false,
    allUsers: [],
    projectUsers: [],
    loading: true,
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

    const { navigation } = this.props;
    const projectId = navigation.getParam('projectId', null);

    firestore.collection("Projects").doc(projectId).onSnapshot((doc) => {
      this.setState({ projectUsers: doc.data().Users })
    })

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

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  renderDatePicker = () => {
    if (!this.state.keyboardIsVisible) {
      return (
        /* Due date */
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            Due Date:
          </Text>
          <Text style={{ color: 'mediumpurple' }}>
            {moment(this.state.dueDate).format('LLL')}
          </Text>
          <TouchableHighlight
            style={styles.buttonPale}
            onPress={this._showDateTimePicker}>
            <Text style={styles.buttonText}>Select Date</Text>
          </TouchableHighlight>
          <DateTimePicker
            mode={'datetime'}
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
          />
        </View>
      )
    }
  }

  renderButtons = () => {
    if (!this.state.keyboardIsVisible) {
      return ([

        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit}
          underlayColor={"lavender"}>
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableHighlight>,

        <TouchableHighlight
          style={styles.button2}
          onPress={() => this.props.navigation.goBack()}
          underlayColor={"lavender"}>
          <Text style={styles.buttonText}>Dismiss</Text>
        </TouchableHighlight>
      ]
      )
    }
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    this.setState({
      dueDate: new Date(date)
    });
    this._hideDateTimePicker();
  };

  handleSubmit = () => {
    const { navigation } = this.props;
    const projectId = navigation.getParam('projectId', null);
    let idList = []
    this.state.allUsers.forEach((user) => {
      if (user.isSelected) {
        idList.push(user.userId)
      }
    })
    firestore.collection("Tasks").add({
      Name: this.state.taskName,
      Description: "",
      DateAdded: new Date(),
      DueDate: this.state.dueDate,
      ProjectId: projectId,
      Users: idList,
      AddedBy: auth.currentUser.uid,
      isCompleted: false
    }).then(() => this.props.navigation.goBack())
  };

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
    
    return (
      <View style={{ flex: 1 }}>

        {/* Task name */}
        <Input
          label="Task name"
          onChangeText={(taskName) => this.setState({ taskName })}
          selectionColor={"purple"}
        />
        {/* Date Picker */}
        {this.renderDatePicker()}
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
        {this.renderButtons()}

      </View>
    );
  }
}


