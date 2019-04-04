import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  TextInput,
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

export default class AddItem extends Component {
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
      <View style={styles.main}>
        <Text style={styles.title}>Add Item</Text>
        <TextInput style={styles.itemInput} onChange={this.handleChange} />
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableHighlight>

        <Text style={styles.title}>Del Items:</Text>
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleDel}>
          <Text style={styles.buttonText}>Del</Text>
        </TouchableHighlight>
      </View>
    );
  }
}


