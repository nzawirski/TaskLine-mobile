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

export default class AddProjectScreen extends Component {
  state = {
    projectName: ''
  };

  handleSubmit = () => {
    firestore.collection("Projects").add({
      Name: this.state.projectName,
      Date: new Date(),
      Users: [auth.currentUser.uid]
    }).then(()=>this.props.navigation.goBack())
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.projectsView}>
          <Text style={styles.title}>Project Name:</Text>
          <TextInput 
            style={styles.itemInput} 
            onChangeText={(projectName) => this.setState({projectName})} 
            selectionColor={"purple"}
          />

        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit}
          underlayColor={"lavender"}>
          <Text style={styles.buttonText}>Add Project</Text>
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


