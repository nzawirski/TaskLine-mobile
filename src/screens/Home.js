import React, { Component } from 'react';
import { Button, View, Text, TouchableHighlight } from 'react-native';
import DisplayUserName from '../components/DisplayUserName';

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
      <View>
        <Text>Home Screen</Text>
        <Button
          title="Add an Item"
          onPress={() => this.props.navigation.navigate('AddItem')}
        />
        <Button
          title="List of Items"
          color="green"
          onPress={() => this.props.navigation.navigate('List')}
        />
        <DisplayUserName></DisplayUserName>
        <TouchableHighlight
          
          onPress={this.logOut}>
          <Text>Log Out</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
