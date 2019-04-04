import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
} from 'react-native';

import { styles } from '../styles';
import { db } from '../config';
import { firestore } from '../config';
import {auth} from '../config';


export const addItem =  (item) => {
    db.ref('items/'+auth.currentUser.uid).set({
        email: auth.currentUser.email
    });

    firestore.collection("Projects").doc(auth.currentUser.uid).collection("Task").add({
      Name: "Dogu",
      Date: new Date(),
  })
}

export const delItem =  () => {
    db.ref('/items').remove();
}

export default class AddProjectScreen extends Component {
  state = {
    name: ''
  };

  handleChange = e => {
    this.setState({
      name: e.nativeEvent.text
    });
  };
  handleSubmit = () => {
    addItem(this.state.name);
  };
  handleDel = () => {
    delItem(this.state.name);
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.projectsView}>
          <Text style={styles.title}>TODO: handle adding projects</Text>
          
        </View>
      </View>
    );
  }
}


