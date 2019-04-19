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

import ColorPalette from "react-native-color-palette";

import { styles, theme } from "../styles";
import CategoryItem from "../components/CategoryItem";

import { firestore } from "../config";

export default class ProjectSettings extends Component {
  state = {
    pid: "",
    projectName: "",
    users: [],
    loading: true,
    newCatColor: "#E74C3C"
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
        let categoryList = [];
        doc
          .data()
          .Categories.forEach(category =>
            categoryList.push({
              Name: category.Name,
              Color: category.Color,
              isSelected: false
            })
          );

        this.setState({
          projectName: doc.data().Name,
          users: doc.data().Users,
          categories: categoryList
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

  handleSubmit = () => {
    let newCategories = [];

    if (this.state.categories) {
      newCategories = this.state.categories;
    }

    if (
      !this.state.categories.some(element => {
        return element.Name === this.state.newCatName;
      })
    ) {
      newCategories.push({
        Name: this.state.newCatName,
        Color: this.state.newCatColor
      });
    }

    firestore
      .collection("Projects")
      .doc(this.state.pid)
      .update({
        Categories: newCategories
      });
  };

  deleteCategories = () => {
    let newCategories = [];

    this.state.categories.forEach((category)=>{
      if(!category.isSelected){
        newCategories.push({Name: category.Name, Color: category.Color})
      }
    })

    firestore
    .collection("Projects")
    .doc(this.state.pid)
    .update({
      Categories: newCategories
    });
  }

  selectItem = catName => {
    let categoryList = this.state.categories;

    categoryList.forEach(item => {
      if (catName == item.Name) {
        item.isSelected = !item.isSelected;
      }
    });

    this.setState({
      categories: categoryList
    });
  };

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
          {!this.state.keyboardIsVisible ? (
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Users</Text>
              <FlatList
                data={userList}
                contentContainerStyle={{
                  flexDirection: "row",
                  flexWrap: "wrap"
                }}
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
          ) : (
            <View />
          )}

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
                <Button
                  buttonStyle={{
                    marginHorizontal: 10
                  }}
                  icon={<Icon name="minus-circle" size={15} color="white" />}
                  onPress={() => this.deleteCategories()}
                />
              </View>
            </View>
            <View style={{ flex: 1, marginTop: -40 }}>
              <ColorPalette
                onChange={newCatColor => this.setState({ newCatColor })}
                value={this.state.newCatColor}
                colors={[
                  "#1ABC9C",
                  "#2ECC71",
                  "#3498DB",
                  "#9B59B6",
                  "#E91E63",
                  "#F1C40F"
                ]}
                title={""}
                icon={
                  <Icon name={"check-circle-o"} size={25} color={"white"} />
                }
              />
            </View>
            <View style={{ flex: 2 }}>
              <FlatList
                data={categoryList}
                extraData={this.state}
                renderItem={({ item }) => (
                  <CategoryItem
                    onPress={() => this.selectItem(item.Name)}
                    categoryName={item.Name}
                    categoryColor={item.Color}
                    isSelected={item.isSelected}
                  />
                )}
              />
            </View>
          </View>
        </View>
      </ThemeProvider>
    );
  }
}
