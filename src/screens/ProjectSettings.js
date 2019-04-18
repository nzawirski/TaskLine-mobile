import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StatusBar
} from "react-native";

import { Button, Avatar, Tooltip } from "react-native-elements";
import { ThemeProvider } from "react-native-elements";

import Icon from "react-native-vector-icons/FontAwesome";

import { styles, theme } from "../styles";
import ChangeLogItem from "../components/ChangeLogItem";

import { firestore } from "../config";

export default class ProjectSettings extends Component {
  state = {
    pid: "",
    projectName: "",
    users: [],
    loading: true
  };

  componentDidMount() {
    //Get passed params and provide fallback value
    const { navigation } = this.props;
    const projectId = navigation.getParam("projectId", null);

    this.setState({ pid: projectId });

    firestore
      .collection("Projects")
      .doc(projectId)
      .onSnapshot(doc => {
        this.setState({
          projectName: doc.data().Name,
          users: doc.data().Users
        });

        firestore.collection("Users").onSnapshot(doc2 => {
          let users = [];
          doc2.forEach(user => {
            if (doc.data().Users.includes(user.id)) {
              users.push({
                userId: user.id,
                nick: user.data().nick,
                email: user.data().email,
                icon: user.data().icon
              });
            }
          });
          this.setState({ projectUsers: users, loading: false });
        });
      });
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

    let userList = this.state.projectUsers;

    return (
      <ThemeProvider theme={theme}>
        <View style={styles.main}>
          <View style={{ flex: 1, marginTop: 10 }}>
            <Text>Users: </Text>
            <FlatList
              data={userList}
              contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
              renderItem={({ item }) => (
                <Tooltip
                  backgroundColor="mediumpurple"
                  withOverlay={false}
                  popover={<Text>{item.nick}</Text>}
                >
                  <Avatar rounded size="medium" source={{ uri: item.icon }} />
                </Tooltip>
              )}
            />
            <Button
              buttonStyle={{
                marginHorizontal: 10
              }}
              icon={<Icon name="user-plus" size={15} color="white" />}
              onPress={() =>
                this.props.navigation.navigate("ManageUsers", {
                  projectId: this.state.pid
                })
              }
              title=" Manage Users"
            />
          </View>
        </View>
      </ThemeProvider>
    );
  }
}
