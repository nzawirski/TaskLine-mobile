import React, { Component } from 'react';
import { Button, View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';

import { styles } from '../styles';
import { auth } from '../config';

export default class Login extends Component {
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
    
    handleSubmit = () => {
        auth.signInWithEmailAndPassword(this.state.email, this.state.password).then(()=>
        this.props.navigation.navigate(auth.currentUser ? 'App' : 'Auth'))
        
    };

  render() {
    return (
      <View style={styles.main}>
        <Text style={styles.title}>Log in:</Text>
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
          <Text style={styles.buttonText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.button}
          onPress={() => this.props.navigation.navigate('SignUp')}
          underlayColor={"lavender"}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

