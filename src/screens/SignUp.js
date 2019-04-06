import React, { Component } from 'react';
import { View, Text, TextInput, TouchableHighlight } from 'react-native';

import { styles } from '../styles';
import { auth } from '../config';
import { firestore } from '../config';

export default class SignUp extends Component {
  state = {
    nick: '',
    email: '',
    password: '',
    user: null,
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      this.setState({ user })
    })
  }

  handleSubmit = () => {
    //create user
    auth.createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
      //save him in database
      //console.warn(auth.currentUser)
      firestore.collection("Users").doc(auth.currentUser.uid).set({
        nick: this.state.nick,
        email: auth.currentUser.email,
        icon: "https://image.flaticon.com/icons/png/128/149/149071.png",
      })

      //if succeeded go to app stack
    this.props.navigation.navigate(auth.currentUser ? 'App' : 'Auth');
    })

    //TODO: handle errors

  };

  render() {
    return (
      <View style={styles.main}>
        <Text style={styles.title}>Sign Up:</Text>

        <Text style={styles.title}>Nickname:</Text>
        <TextInput 
          style={styles.itemInput} 
          onChangeText={(nick) => this.setState({nick})} 
          selectionColor={"purple"}
        />

        <Text style={styles.title}>Email:</Text>
        <TextInput 
          style={styles.itemInput} 
          onChangeText={(email) => this.setState({email})} 
          selectionColor={"purple"}
        />

        <Text style={styles.title}>Pass:</Text>
        <TextInput
          secureTextEntry={true} 
          style={styles.itemInput} 
          onChangeText={(password) => this.setState({password})}
          selectionColor={"purple"}
        />

        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit}
          underlayColor={"lavender"}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
