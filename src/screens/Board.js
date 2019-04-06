import React, { Component } from 'react';
import { TouchableHighlight, View, Text } from 'react-native';
import { styles } from '../styles';

import { firestore } from '../config';

export default class Board extends Component {
  
  state = {
    projectName: "",
  }

  db = (pid) => {
    firestore.collection("Projects").doc(pid).onSnapshot((doc)=>{
      this.setState({ 
        projectName: doc.data().Name,
      });
    })
  }

  render() {

    //Get passed params and provide fallback value
    const { navigation } = this.props;
    const projectId = navigation.getParam('projectId', null);
    this.db(projectId);

    return (
      <View style={{flex: 1}}>
      <View style={{flex: 5,}}>
        <Text style={styles.title}>Project {this.state.projectName}</Text>
      </View>

        <View style={styles.purple}>
        <TouchableHighlight
          style={styles.button2}
          onPress={() => this.props.navigation.navigate('AddUser', {projectId: projectId})}
          underlayColor={"lavender"}>
          <Text style={styles.buttonText}>Add user</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button2}
          onPress={() => this.props.navigation.navigate('AddTask', {projectId: projectId})}
          underlayColor={"lavender"}>
          <Text style={styles.buttonText}>Add task</Text>
        </TouchableHighlight>
        </View>
      </View>
    );
  }
}
