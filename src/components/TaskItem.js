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
    number: 0,
    categories: [],
    isOverlayActive: false
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
      categoryList.push({ Name: "Base", Color: "mediumpurple" })
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

  startTimer = () => {
    this.setState({ number: this.state.number + 1 });
    this.timer = setTimeout(this.startTimer, 75);

    if (this.state.number >= 5) {
      this.setState({ isOverlayActive: true });
    }
  };

  stopTimer = () => {
    if (this.state.number > 1 && this.state.number < 5) {
      this.props.navigation.navigate("TaskScreen", {
        taskId: this.props.TaskId
      });
    }

    this.setState({ number: 0 });
    clearTimeout(this.timer);
  };

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

    this.setState({ isOverlayActive: false });
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

    return (
      <TouchableOpacity
        style={styles.box}
        onPressIn={this.startTimer}
        onPressOut={this.stopTimer}
      >
        {this.state.isOverlayActive ? (
          <Overlay
            onBackdropPress={() => this.setState({ isOverlayActive: false })}
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
        ) : (
          <View />
        )}
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>{categories}</View>
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
    );
  }
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: "#484a4c"
  },

  title: {
    fontWeight: "bold"
  }
});

export default withNavigation(TaskItem);
