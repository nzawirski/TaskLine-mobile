import React, { Component } from 'react';
import { Button, View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';

import { styles } from '../styles';
import { auth } from '../config';
import { db } from '../config';
import { firestore } from '../config';

export default class SignUp extends Component {
  state = {
    email: '',
    password: '',
    user: null,
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      this.setState({ user })
    })
  }

  handleChange1 = e => {
    this.setState({
      email: e.nativeEvent.text
    });
  };

  handleChange2 = e => {
    this.setState({
      password: e.nativeEvent.text
    });
  };

  handleSubmit = () => {
    //create user
    auth.createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
      //save him in database
      //console.warn(auth.currentUser)
      firestore.collection("Users").doc(auth.currentUser.uid).set({
        email: auth.currentUser.email
      })

      //if succeeded go to app stack
    this.props.navigation.navigate(auth.currentUser ? 'App' : 'Auth');
    })

    //TODO: handle errors

  };

  render() {
    return (
      <View style={styles.main}>
        <Text>SignUp Screen:</Text>
        <Text style={styles.title}>Email:</Text>
        <TextInput style={styles.itemInput} onChange={this.handleChange1} />

        <Text style={styles.title}>Pass:</Text>
        <TextInput secureTextEntry={true} style={styles.itemInput} onChange={this.handleChange2} />

        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
