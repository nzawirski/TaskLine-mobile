import React, { Component } from 'react';
import { TouchableHighlight, View, Text } from 'react-native';
import { styles } from '../styles';

import { firestore } from '../config';

export default class Board extends Component {
  
  state = {
    pid: "",
    projectName: "",
    users: [],
  }

  componentDidMount(){
    //Get passed params and provide fallback value
    const { navigation } = this.props;
    const projectId = navigation.getParam('projectId', null);

    this.setState({pid: projectId});

    firestore.collection("Projects").doc(projectId).onSnapshot((doc)=>{
      this.setState({ 
        projectName: doc.data().Name,
      });
    })

    firestore.collection("Projects").doc(projectId).onSnapshot((doc)=>{
      this.setState({ users: doc.data().Users});
    })
  }

  render() {

    let users = [];
    this.state.users.forEach((i)=>{users.push(<Text>U: {i}</Text>)})

    return (
      <View style={{flex: 1}}>
      <View style={{flex: 5,}}>
        <Text style={styles.title}>Project {this.state.projectName}</Text>
        {users}
      </View>

        <View style={styles.purple}>
        <TouchableHighlight
          style={styles.button2}
          onPress={() => this.props.navigation.navigate('AddUser', {projectId: this.state.pid})}
          underlayColor={"lavender"}>
          <Text style={styles.buttonText}>Add user</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button2}
          onPress={() => this.props.navigation.navigate('AddTask', {projectId: this.state.pid})}
          underlayColor={"lavender"}>
          <Text style={styles.buttonText}>Add task</Text>
        </TouchableHighlight>
        </View>
      </View>
    );
  }
}
