import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';

class TaskItem extends React.Component {

  render() {
    return (
      <TouchableOpacity
        style={styles.box}
      >
        <View style={styles.mark}><Text>{this.props.taskName}</Text>
        </View>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#e9e9e9",
    alignSelf: "stretch",
    marginBottom: 10,
  },
  mark: {
    borderLeftColor: "mediumpurple",
    borderLeftWidth: 5,
    padding: 10,

  },
})

export default withNavigation(TaskItem);