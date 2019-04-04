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
        auth.signInWithEmailAndPassword(this.state.email, this.state.password).then(()=>
        this.props.navigation.navigate(auth.currentUser ? 'App' : 'Auth'))
        
    };

  render() {
    return (
      <View style={styles.main}>
        <Text>Login Screen:</Text>
        <Text style={styles.title}>Email:</Text>
        <TextInput style={styles.itemInput} onChange={this.handleChange1} />

        <Text style={styles.title}>Pass:</Text>
        <TextInput secureTextEntry={true} style={styles.itemInput} onChange={this.handleChange2} />

        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.button2}
          onPress={() => this.props.navigation.navigate('SignUp')}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

