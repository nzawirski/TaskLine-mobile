import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  TextInput,
} from 'react-native';

import { styles } from '../styles';
import { db } from '../config';
import { firestore } from '../config';
import {auth} from '../config';


export default class Projects extends Component {
  state = {
    name: ''
  };

  handleChange = e => {
    this.setState({
      name: e.nativeEvent.text
    });
  };
  handleSubmit = () => {
    addItem(this.state.name);
  };
  handleDel = () => {
    delItem(this.state.name);
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.projectsView}>
          <Text style={styles.title}>Projects</Text>
          <Text>TODO: show projects</Text>
        </View>
        <View style={styles.main}>
        <TouchableHighlight
          style={styles.button}
          onPress={() => this.props.navigation.navigate('AddProjectScreen')}>
          <Text style={styles.buttonText}>Add project</Text>
        </TouchableHighlight>
        </View>
      </View>
    );
  }
}


