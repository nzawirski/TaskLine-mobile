import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { Input, Button } from 'react-native-elements';
import { ThemeProvider } from 'react-native-elements';

import Icon from 'react-native-vector-icons/FontAwesome';

import { styles, theme } from '../styles';

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
      <ThemeProvider theme={theme}>
        <View style={styles.main}>
          <Text style={styles.title}>Sign Up</Text>

          <Input
            label="User Name"
            onChangeText={(nick) => this.setState({ nick })}
            inputStyle={{color: "#89939B"}}
            selectionColor={"purple"}
          />

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
                  name="window-close"
                  size={15}
                  color="white"
                />
              }
              onPress={() => this.props.navigation.goBack()}
              title="Go Back">
            </Button>

            <Button
              buttonStyle={{
                marginHorizontal: 10
              }}
              icon={
                <Icon
                  name="check-circle"
                  size={15}
                  color="white"
                />
              }
              onPress={this.handleSubmit}
              title="Sign Up">
            </Button>
          </View>
        </View>
      </ThemeProvider>
    );
  }
}
