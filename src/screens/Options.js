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
    loading: true,
    isPasswordOverlayActive: false
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
            onPress={this.onApply}
            title=" Apply"
          />
        </View>
      );
    }
  };

  onApply = () => {
    //open overlay
    this.setState({ isPasswordOverlayActive: true });
  }

  onSubmit = () => {

    if (this.state.currentPass) {
      //hide overlay
      this.setState({ isPasswordOverlayActive: false });
      // reauthenticate
      this.reauthenticate(this.state.currentPass).then(() => {
        // then apply changes

        /** TODO: This part should work like a transaction to prevent inconsitencies*/
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
        /****************************************************************************/

        if (this.state.newPass) {
          auth.currentUser.updatePassword(this.state.newPass).catch((error) => {
            Alert.alert(error.message);
          })
        }

      }).then(() => {
        Alert.alert("Changes applied successfuly")
      }).catch((error) => {
        Alert.alert(error.message);
      })
    } else {
      Alert.alert("Please enter your password");
    }
  }

  reauthenticate = (currentPass) => {
    let user = auth.currentUser;
    let cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPass);
    return user.reauthenticateWithCredential(cred);
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

          {/* Buttons */}
          {this.renderButtons()}
        </View>

        {/* Overlay */}
        <Overlay
          height={420}
          isVisible={this.state.isPasswordOverlayActive}
          onBackdropPress={() => this.setState({ isPasswordOverlayActive: false })}
        >
          <Text style={{
            fontSize: 24,
            textAlign: "center"
          }}>
            You need to provide your current password before applying changes
            </Text>

          <Input
            secureTextEntry={true}
            onChangeText={currentPass => this.setState({ currentPass })}
            label="Current password"
          />
          <View style={styles.buttonContainer}>
            <Button
              buttonStyle={{
                marginHorizontal: 10
              }}
              icon={<Icon name="check-circle" size={15} color="white" />}
              onPress={this.onSubmit}
              title=" Submit"
            />
          </View>

        </Overlay>
      </ThemeProvider>

    );
  }
}
