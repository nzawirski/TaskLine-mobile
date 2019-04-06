import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import { firestore } from '../config';

class TaskItem extends React.Component {

  state = {
    user: ""
  }

  componentDidMount() {
    firestore.collection('Users').doc(this.props.addedBy).onSnapshot((doc)=> {
      this.setState({ user: doc.data().nick });
    })
  }

  render() {
    let date = new Date(this.props.dateAdded.seconds.toString() * 1000).toString();

    return (
      <TouchableOpacity
        style={styles.box}
      >
        <View style={styles.mark}>
          <Text>{this.props.taskName}</Text>
          <Text>added by: {this.state.user} on {date}</Text>
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
  title: {
    fontWeight: 'bold'
  }
})

export default withNavigation(TaskItem);