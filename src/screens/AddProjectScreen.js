import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ScrollView
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import { styles } from '../styles';
import { firestore } from '../config';
import { auth } from '../config';
import UserItem from '../components/UserItem'

export default class AddProjectScreen extends Component {
  state = {
    projectName: '',
    userSearch: '',
    allUsers: [],
    chosenUsers: [],
  };

  handleSubmit = () => {
    firestore.collection("Projects").add({
      Name: this.state.projectName,
      Date: new Date(),
      Users: [auth.currentUser.uid]
    }).then(() => this.props.navigation.goBack())
  };

  componentDidMount() {
    firestore.collection("Users").onSnapshot((doc) => {
      let users = [];
      doc.forEach((user) => {
        users.push([user.id, user.data().nick])
      })
      this.setState({ allUsers: users })
    })
  }

  render() {
    let userList = [];
    this.state.allUsers.forEach((i) => {
      userList.push(<UserItem userId={i[0]} nick={i[1]}></UserItem>)
    });
    console.log(this.state.allUsers)
    return (

      <View style={{ flex: 1 }}>
        <View style={styles.projectsView}>

          <Input
            label="Project name"
            onChangeText={(projectName) => this.setState({ projectName })}
            selectionColor={"purple"}
          />

          <Input
            label="Add collaborators"
            onChangeText={(projectName) => this.setState({ projectName })}
            selectionColor={"purple"}
          />

          <View style={{ flex: 1 }}><ScrollView>{userList}</ScrollView></View>

          <Button
            icon={
              <Icon
                name="check-circle"
                size={15}
                color="white"
              />
            }
            onPress={this.handleSubmit}
            color="lavender"
            title="Add Project">
          </Button>

          <Button
            icon={
              <Icon
                name="window-close"
                size={15}
                color="white"
              />
            }
            onPress={() => this.props.navigation.goBack()}
            color="lavender"
            title="Dismiss">
          </Button>

        </View>
      </View>
    );
  }
}


