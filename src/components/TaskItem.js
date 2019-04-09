import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import { firestore } from '../config';
import moment from 'moment';
import 'moment/locale/en-gb'

class TaskItem extends React.Component {

  state = {
    user: ""
  }

  componentDidMount() {
    firestore.collection('Users').doc(this.props.AddedBy).onSnapshot((doc)=> {
      this.setState({ user: doc.data().nick });
    })
  }

  render() {
    let dateAdded = new Date(this.props.DateAdded.seconds * 1000);
    let dueDate = new Date(this.props.DueDate.seconds * 1000);

    return (
      <TouchableOpacity
        style={styles.box}
      >
        <View style={styles.mark}>
          <Text>{this.props.TaskName}</Text>
          <Text>added by: {this.state.user} {moment(dateAdded).fromNow()} {"\n"}
          Due Date {moment(dueDate).format('LLL')} ({moment(dueDate).fromNow()})</Text>
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