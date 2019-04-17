import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { Input, Button } from 'react-native-elements';
import { ThemeProvider } from 'react-native-elements';

import Icon from 'react-native-vector-icons/FontAwesome';

import { styles, theme } from '../styles';
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
    <ThemeProvider theme={theme}> 
      <View style={styles.main}>
        <Text style={styles.title}>Log in</Text>
        <Input
          label="Email"
          onChangeText={(email) => this.setState({ email })}
          inputStyle={{color: "#89939B"}}
          selectionColor={"purple"}
        />

        <Input
          label="Password"
          onChangeText={(password) => this.setState({ password })}
          inputStyle={{color: "#89939B"}}
          secureTextEntry={true}
          selectionColor={"purple"}
        />

        <View style={styles.buttonContainer}>
            <Button
              buttonStyle={{
                marginHorizontal: 10
              }}
              icon={
                <Icon
                  name="user-plus"
                  size={15}
                  color="white"
                />
              }
              onPress={() => this.props.navigation.navigate('SignUp')}
              title=" Sign Up">
            </Button>
  
            <Button
              buttonStyle={{
                marginHorizontal: 10
              }}
              icon={
                <Icon
                  name="sign-in"
                  size={15}
                  color="white"
                />
              }
              onPress={this.handleSubmit}
              title=" Login">
            </Button>
          </View>

      </View>
      </ThemeProvider>
    );
  }
}

