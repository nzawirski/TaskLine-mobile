import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from "react-native";
import { withNavigation } from "react-navigation";

import { Overlay, Button } from "react-native-elements";
import { ThemeProvider } from "react-native-elements";

import { theme } from "../styles";

import Icon from "react-native-vector-icons/FontAwesome";
import CategoryItem from "./CategoryItem";

import { firestore } from "../config";
import moment from "moment";
import "moment/locale/en-gb";

class TaskItem extends React.Component {
  state = {
    user: "",
    categories: [],
    isTagsOverlayActive: false,
    isDeleteOverlayActive: false,
    isCompact: false
  };

  getName() {
    //if AddedBy is empty don't even bother
    if (!this.props.AddedBy) {
      this.setState({ user: "unknown" });
      return null;
    }
    //try to get user name
    firestore
      .collection("Users")
      .doc(this.props.AddedBy)
      .onSnapshot(doc => {
        if (doc.exists) {
          //user name found
          this.setState({ user: doc.data().nick });
        } else {
          //couldn't find the name
          this.setState({ user: "unknown" });
        }
      }),
      function(error) {
        //we probably never get to this block but who knows
        this.setState({ user: "unknown" });
      };
  }

  getCategories() {
    let categoryList = [];
    if (this.props.ProjectCategories) {
      this.props.ProjectCategories.forEach(item => {
        if (
          this.props.Categories.some(element => {
            return element.Name == item.Name;
          })
        ) {
          categoryList.push({
            Name: item.Name,
            Color: item.Color,
            isSelected: true
          });
        } else {
          categoryList.push({
            Name: item.Name,
            Color: item.Color,
            isSelected: false
          });
        }
      });
    } else {
      categoryList.push({ Name: "Base", Color: "mediumpurple" });
    }
    this.setState({ categories: categoryList });
  }

  componentDidMount() {
    this.getCategories();
    this.getName();
  }

  componentWillReceiveProps = () => {
    //wait 100ms for item to realise userId has changed
    setTimeout(() => {
      this.getCategories();
      this.getName();
    }, 100);
  };

  deleteTask = () => {
    firestore.collection("Tasks").doc(this.props.TaskId).delete()

    this.setState({isCompact: false})
    this.selectItem({isDeleteOverlayActive: false})
  }

  handleSubmit = () => {
    let catList = [];
    this.state.categories.forEach(cat => {
      if (cat.isSelected) {
        catList.push({ Name: cat.Name, Color: cat.Color });
      }
    });

    firestore
      .collection("Tasks")
      .doc(this.props.TaskId)
      .update({
        Categories: catList
      });

    this.setState({ isTagsOverlayActive: false });
  };

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

  render() {
    let dateAdded = new Date(this.props.DateAdded.seconds * 1000);
    let dueDate = new Date(this.props.DueDate.seconds * 1000);

    let categories = [];

    this.props.Categories.forEach(item =>
      categories.push(
        <View
          style={{
            width: 6,
            height: 22,
            marginLeft: 5,
            marginTop: -10,
            backgroundColor: item.Color
          }}
        />
      )
    );

    let categoryList = this.state.categories;

    if (this.state.isCompact) {
      return (
        <View
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#484a4c",
            backgroundColor: "mediumpurple",
            margin: 10,
            padding: 10,
            flexDirection: "row"
          }}
        >
          <View style={{ flex: 1 }}>
            {/* Edit */}
            <TouchableOpacity
              style={{
                flex: 1,
                height: 140,
                alignItems: "center",
                justifyContent: "center"
              }}
              onPress={() =>{
                this.props.navigation.navigate("TaskScreen", {
                  taskId: this.props.TaskId
                })
                this.setState({ isCompact: false });
              }
              }
            >
              <Icon name="edit" size={15} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={{ flex: 1 }}>
          {/* Tags */}
            <TouchableOpacity
              style={{
                flex: 1,
                height: 70,
                alignItems: "center",
                justifyContent: "center"
              }}
              onPress={() =>
                this.setState({ isTagsOverlayActive: true, isCompact: false })
              }
            >
              <Icon name="tags" size={15} color="white" />
            </TouchableOpacity>
          {/* Delete */}
            <TouchableOpacity
              style={{
                flex: 1,
                height: 70,
                alignItems: "center",
                justifyContent: "center"
              }}
              onPress={() =>
                this.setState({ isDeleteOverlayActive: true, isCompact: false })
              }
            >
              <Icon name="trash" size={15} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.box}>
          <TouchableOpacity
            style={{ minHeight: 140 }}
            onPress={() => this.setState({ isCompact: true })}
          >
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {categories}
            </View>
            <Text style={{ color: "mediumpurple" }}>{this.props.TaskName}</Text>
            <Text>
              Added by:{" "}
              <Text style={{ color: "mediumpurple" }}>{this.state.user}</Text>
            </Text>
            <Text>({moment(dateAdded).fromNow()})</Text>
            <Text>Due Date:</Text>
            <Text>{moment(dueDate).format("LLL")}</Text>
            <Text>({moment(dueDate).fromNow()})</Text>
          </TouchableOpacity>
        {/* Choosing tags */}
          <Overlay
            isVisible={this.state.isTagsOverlayActive}
            onBackdropPress={() => this.setState({ isTagsOverlayActive: false })}
          >
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
            <ThemeProvider theme={theme}>
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
            </ThemeProvider>
          </Overlay>

          {/* Deleting task "Are you sure?" */}
          <Overlay
            height={210}
            isVisible={this.state.isDeleteOverlayActive}
            onBackdropPress={() => this.setState({ isDeleteOverlayActive: false })}
          >
            <Text style={{ 
              fontSize: 24,
              textAlign: "center" 
              }}>
            Are you sure you want to delete this task?
            </Text>
            <ThemeProvider theme={theme}>
              <View style={styles.buttonContainer}>
                <Button
                  buttonStyle={{
                    marginVertical: 10
                  }}
                  icon={<Icon name="check-circle" size={15} color="white" />}
                  onPress={this.deleteTask}
                  title=" Yes"
                />
              
                <Button
                  buttonStyle={{
                    marginVertical: 10
                  }}
                  icon={<Icon name="check-circle" size={15} color="white" />}
                  onPress={() => this.setState({ isDeleteOverlayActive: false })}
                  title=" Nah"
                />
              </View>
            </ThemeProvider>
          </Overlay>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderColor: "#484a4c"
  },

  title: {
    fontWeight: "bold"
  }
});

export default withNavigation(TaskItem);
