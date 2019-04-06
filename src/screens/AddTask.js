import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
} from 'react-native';

import { styles } from '../styles';
import { firestore } from '../config';
import {auth} from '../config';

export default class AddTask extends Component {
  state = {
    taskName: ''
  };

  handleSubmit = () => {
    const { navigation } = this.props;
    const projectId = navigation.getParam('projectId', null);
    // todo: due date and users
    firestore.collection("Tasks").add({
      Name: this.state.taskName,
      DateAdded: new Date(),
      DueDate: new Date(),
      ProjectId: projectId,
      Users: [auth.currentUser.uid],
      AddedBy: auth.currentUser.uid
    }).then(()=>this.props.navigation.goBack())
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.projectsView}>
          <Text style={styles.title}>Task Name:</Text>
          <TextInput 
            style={styles.itemInput} 
            onChangeText={(taskName) => this.setState({taskName})} 
            selectionColor={"purple"}
          />

        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit}
          underlayColor={"lavender"}>
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.button}
          onPress={() => this.props.navigation.goBack()}
          underlayColor={"lavender"}>
          <Text style={styles.buttonText}>Dismiss</Text>
        </TouchableHighlight>
          
        </View>
      </View>
    );
  }
}


