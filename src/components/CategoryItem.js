import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default class CategoryItem extends Component {
  render() {
    return (
      <TouchableOpacity style={styles.box} onPress={this.props.onPress}>
        {this.props.isSelected ? (
          <View style={styles.mark}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ marginLeft: 10 }}>{this.props.categoryName}</Text>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  borderColor: "black",
                  marginLeft: 10,
                  borderWidth: 1,
                  backgroundColor: this.props.categoryColor
                }}
              />
            </View>
          </View>
        ) : (
          <View style={[styles.mark, { borderLeftColor: "#e9e9e9" }]}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ marginLeft: 10 }}>{this.props.categoryName}</Text>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  borderColor: "black",
                  marginLeft: 10,
                  borderWidth: 1,
                  backgroundColor: this.props.categoryColor
                }}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#e9e9e9",
    alignSelf: "stretch",
    marginBottom: 10,
    padding: 10
  },
  mark: {
    borderLeftColor: "mediumpurple",
    borderLeftWidth: 5
  }
});
