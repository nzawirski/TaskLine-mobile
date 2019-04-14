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
    keyboardIsVisible: false,
    loading: true,
  };

  handleSubmit = () => {
    let idList = []
    this.state.allUsers.forEach((user) => {
      if(user.isSelected){
        idList.push(user.userId)
      }
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

    //get data about all users
    firestore.collection("Users").onSnapshot((doc) => {
      let users = [];
      doc.forEach((user) => {
        if(user.id==auth.currentUser.uid){
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

  selectItem = (uEmail) => {
    let userList = this.state.allUsers;

    userList.forEach((item)=>{
      if(uEmail==item.email){
        if(item.userId!=auth.currentUser.uid){
          item.isSelected = !item.isSelected;
        }
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
 
    let userList = this.state.allUsers;
    if(this.state.userSearch!=""){
    userList = userList.filter((user) => {
      return user.isSelected == true || user.nick.toLowerCase().includes(this.state.userSearch.toLowerCase()) || user.email.toLowerCase().includes(this.state.userSearch.toLowerCase());
    });
    } else {
      userList = userList.filter((user) => {
        return user.isSelected == true;
      });
    }


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
                  onPress={() => this.selectItem(item.email)}
                  id={item.userId}
                  nick={item.nick}
                  email={item.email}
                  isSelected={item.isSelected}>
                </UserItem>}
            />
          
          </View>
          {this.renderButtons()}
        </View>
      </ThemeProvider>
    );
  }
}


