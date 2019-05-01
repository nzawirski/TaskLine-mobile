import React, { Component } from "react";
import {
  View, Text, ActivityIndicator,
  StatusBar, Keyboard
} from "react-native";
import { styles, theme } from "../styles";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Button, Overlay } from "react-native-elements";
import { ThemeProvider } from "react-native-elements";
import { auth, firestore } from "../config";
import moment from "moment";
import "moment/locale/en-gb";
export default class Options extends Component {

  state = {
    loading: true
  };

  componentDidMount() {
    //keyboard listeners
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        this.setState({ keyboardIsVisible: true });
      }
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        this.setState({ keyboardIsVisible: false });
      }
    );

    firestore
      .collection("Users")
      .doc(auth.currentUser.uid)
      .onSnapshot(doc => {
        this.setState({
          nick: doc.data().nick,
          email: doc.data().email,
          icon: doc.data().email
        });
        this.setState({ loading: false });
      });

  }

  renderButtons = () => {
    if (!this.state.keyboardIsVisible) {
      return (
        <View style={styles.buttonContainer}>
          <Button
            buttonStyle={{
              marginHorizontal: 10
            }}
            icon={<Icon name="check-circle" size={15} color="white" />}
            onPress={this.handleSubmit}
            title=" Apply"
          />
        </View>
      );
    }
  };

  handleSubmit = () => {
    firestore
    .collection("Users")
    .doc(auth.currentUser.uid)
    .set(
      {
        nick: this.state.nick,
      },
      { merge: true }
    )
  }

  render() {
    if (this.state.loading) {
      return (
        <View>
          <ActivityIndicator />
          <StatusBar barStyle="default" />
        </View>
      );
    }

    return (

      <ThemeProvider theme={theme}>
        <Text style={styles.title}>Options</Text>
        <View style={{ flex: 1 }}>
          {/* nick */}
          <Input
            value={this.state.nick}
            onChangeText={nick => this.setState({ nick })}
            label="Name"
          />
          {/* email */}
          <Input
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
            label="Description"
          />
          {/* Buttons */}
          {this.renderButtons()}
        </View>
      </ThemeProvider>

    );
  }
}
