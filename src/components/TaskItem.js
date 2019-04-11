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

  getName() {
    //if AddedBy is empty don't even bother
    if (!this.props.AddedBy) {
      this.setState({ user: "unknown" })
      return null;
    }
    //try to get user name
    firestore.collection('Users').doc(this.props.AddedBy).onSnapshot((doc) => {
      if (doc.exists) {
        //user name found
        this.setState({ user: doc.data().nick });
      } else {
        //couldn't find the name
        this.setState({ user: "unknown" })
      }
    }), function (error) {
      //we probably never get to this block but who knows
      this.setState({ user: "unknown" })
    }
  }

  componentDidMount() {
    this.getName();
  }

  componentWillReceiveProps = () => {
    //wait 100ms for item to realise userId has changed
    setTimeout(() => {
      this.getName();
    },100)
    
  };
  

  render() {
    let dateAdded = new Date(this.props.DateAdded.seconds * 1000);
    let dueDate = new Date(this.props.DueDate.seconds * 1000);

    return (
      <TouchableOpacity
        style={styles.box}
        onPress={() => { this.props.navigation.navigate('TaskScreen', { taskId: this.props.TaskId }) }}
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