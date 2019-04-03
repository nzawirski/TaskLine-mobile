import React, { Component } from 'react';
import { Button, View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';

import { auth } from '../config';
import { db } from '../config';

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
      console.warn(auth.currentUser)
      db.ref('items/' + auth.currentUser.uid).set({
        email: auth.currentUser.email
      });

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
        <TextInput style={styles.itemInput} onChange={this.handleChange2} />

        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#6565fc'
  },
  title: {
    marginBottom: 20,
    fontSize: 25,
    textAlign: 'center'
  },
  itemInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    color: 'white'
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});
