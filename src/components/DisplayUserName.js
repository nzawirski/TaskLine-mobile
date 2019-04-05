import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { auth } from '../config';

export default class DisplayUserName extends Component {

  render() {
    return (
      <View>
        <Text>Email: {auth.currentUser.email}</Text>
      </View>
    );
  }
}


