import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Keyboard
} from "react-native";

import { Button, Avatar, Tooltip, Input } from "react-native-elements";
import { ThemeProvider } from "react-native-elements";

import Icon from "react-native-vector-icons/FontAwesome";

import { styles, theme } from "../styles";
import CategoryItem from "../components/CategoryItem";

import { firestore } from "../config";

export default class ProjectSettings extends Component {
  state = {
    pid: "",
    projectName: "",
    users: [],
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
          users: doc.data().Users,
          categories: doc.data().Categories
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

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
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
    let categoryList = this.state.categories;

    return (
      <ThemeProvider theme={theme}>
        <View style={styles.main}>
        {!this.state.keyboardIsVisible ?
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Users</Text>
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
          </View> : <View />}

          <View style={{ flex: 2 }}>
            <Text style={styles.title}>Categories</Text>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ flex: 3 }}>
                <Input
                  onChangeText={newCatName => this.setState({ newCatName })}
                  selectionColor={"purple"}
                  placeholder={"New category name..."}
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  buttonStyle={{
                    marginHorizontal: 10
                  }}
                  icon={<Icon name="plus-circle" size={15} color="white" />}
                  onPress={() => this.handleSubmit()}
                />
              </View>
            </View>
            <FlatList
              data={categoryList}
              renderItem={({ item }) => (
                <CategoryItem
                  categoryName={item.Name}
                  categoryColor={item.Color}
                />
              )}
            />
          </View>
        </View>
      </ThemeProvider>
    );
  }
}
