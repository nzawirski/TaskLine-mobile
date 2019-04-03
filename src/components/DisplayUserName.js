import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { auth } from '../config';

export default class DisplayUserName extends Component {


  render() {
    return (
      <View>
        <Text>{auth.currentUser.email}</Text>
      </View>
    );
  }
}


