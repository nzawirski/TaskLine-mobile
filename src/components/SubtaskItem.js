import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { withNavigation } from "react-navigation";

class SubtaskItem extends Component {
  render() {
    return (
      <TouchableOpacity style={styles.box} onPress={this.props.onPress}>
        <View style={[styles.mark, { flexDirection: "row" }]}>
          <Text>{this.props.subtaskName}</Text>
          {this.props.isParent && (
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderColor: "black",
                marginLeft: 10,
                borderWidth: 1,
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text>P</Text>
            </View>
          )}
          {this.props.isSubtask && (
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderColor: "black",
                marginLeft: 10,
                borderWidth: 1,
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text>S</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#e9e9e9",
    alignSelf: "stretch",
    marginBottom: 10
  },
  mark: {
    borderLeftColor: "mediumpurple",
    borderLeftWidth: 5,
    padding: 10
  }
});

export default withNavigation(SubtaskItem);
