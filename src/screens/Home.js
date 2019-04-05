import React, { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import DisplayUserName from '../components/DisplayUserName';

import { styles } from '../styles';
import { auth } from '../config';

export default class Home extends Component {

  logOut = () => {
    try {
      auth.signOut();
      // signed out
    } catch (e) {
      // an error
    }
  }

  render() {
    return (
      <View style={{flex:1}}>
        <View style={styles.projectsView}>
          <DisplayUserName></DisplayUserName>
          <TouchableHighlight
            style={styles.button}
            onPress={this.logOut}
            underlayColor={"lavender"}>
            <Text  style={styles.buttonText}>Log Out</Text>
          </TouchableHighlight>
        </View>
        <View style={{flex:16, backgroundColor: "mediumpurple"}}>
        </View>
      </View>
    );
  }
}
