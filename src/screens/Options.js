import React, { Component } from "react";
import {
  View, Text, ActivityIndicator,
  StatusBar, Keyboard, Alert
} from "react-native";
import { styles, theme } from "../styles";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Button, Overlay } from "react-native-elements";
import { ThemeProvider } from "react-native-elements";
import { auth, firestore } from "../config";
import * as firebase from 'firebase'
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


    this.reauthenticate(this.state.currentPass).then(() => {
      firestore
        .collection("Users")
        .doc(auth.currentUser.uid)
        .set(
          {
            nick: this.state.nick,
            email: this.state.email
          },
          { merge: true }
        )
      auth.currentUser.updateEmail(this.state.email).catch((error) => {
        Alert.alert(error.message);
      })
      auth.currentUser.updatePassword(this.state.newPass).catch((error) => {
        Alert.alert(error.message);
      })
    }).then(()=>{
      Alert.alert("Changes applied successfuly")
    }).catch((error) => {
      Alert.alert(error.message);
    })



  }

  reauthenticate = (currentPass) => {
    let user = auth.currentUser;
    let cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPass);
    return user.reauthenticateWithCredential(cred);
  }

  renderInfo() {
    if (!this.state.keyboardIsVisible) {
      return (<Text style={{ textAlign: "center" }}>You need to provide your current password before applying changes</Text>)
    }
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
        <View style={{ flex: 2 }}>
          {this.renderInfo()}
          <Input
            secureTextEntry={true}
            onChangeText={currentPass => this.setState({ currentPass })}
            label="Current password"
          />
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
            label="Email"
          />
          {/* new password */}
          <Input
            secureTextEntry={true}
            onChangeText={newPass => this.setState({ newPass })}
            label="New password"
          />

        </View>
        <View style={{ flex: 1 }}>
          {/* password */}


          {/* Buttons */}
          {this.renderButtons()}
        </View>
      </ThemeProvider>

    );
  }
}
