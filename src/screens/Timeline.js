import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ItemComponent from '../components/ItemComponent';
import { styles } from '../styles';

export default class Timeline extends Component {
  state = {
    items: []
  };

  componentDidMount() {
    
  }

  render() {
    return (
      <View style={styles.projectsView}>
      </View>
    );
  }
}
