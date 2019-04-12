import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';
import { firestore } from '../config';
import moment from 'moment';
import 'moment/locale/en-gb'

var width = Dimensions.get('window').width;

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
        <View style={[styles.mark, {borderBottomColor: this.props.taskColor,}]}>
          <Text>{this.props.TaskName}</Text>
          <Text>Added by: {this.state.user}{"\n"}({moment(dateAdded).fromNow()})</Text>
          <Text>Due Date:{"\n"}{moment(dueDate).format('LLL')}{"\n"}({moment(dueDate).fromNow()})</Text>
        </View>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  box: {
    width: width/2.2,
    height: width/2.2,
    margin: width/45,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#484a4c',
  },
  mark: {
    borderBottomWidth: 5,
    padding: 10,
    flex: 1,
  },
  title: {
    fontWeight: 'bold'
  }
})

export default withNavigation(TaskItem);