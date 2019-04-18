import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { withNavigation } from "react-navigation";

class TasklineItem extends Component {
  render() {
    let borderWidth = 0;

    if (this.props.isNotLate == 1) {
      borderWidth = 2;
    }

    return (
      <TouchableOpacity
        style={styles.box}
        onPress={() => {
          this.props.navigation.navigate("TaskScreen", {
            taskId: this.props.taskId
          });
        }}
      >
        <View
          style={[
            styles.disp,
            { borderTopColor: "black", borderTopWidth: borderWidth }
          ]}
        >
          <Text style={styles.text}>{this.props.taskName}</Text>
        </View>
        <View
          style={[styles.middle, { backgroundColor: this.props.taskColor }]}
        />
        <View
          style={[
            styles.disp,
            { borderTopColor: "black", borderTopWidth: borderWidth }
          ]}
        >
          <Text style={styles.text}>{this.props.taskDue}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    alignSelf: "stretch",
    flexDirection: "row"
  },
  text: {
    textAlign: "center"
  },

  disp: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    padding: 5
  },

  middle: {
    width: 2
  }
});

export default withNavigation(TasklineItem);
