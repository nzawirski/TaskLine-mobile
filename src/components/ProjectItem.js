import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';

class ProjectItem extends React.Component {

  render() {
    return (
      <TouchableOpacity
        style={styles.box}
        onPress={() => { this.props.navigation.navigate('Board', { projectId: this.props.projectId }) }}>
        <View style={styles.mark}><Text>{this.props.projectName}</Text>
        </View>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#e9e9e9",
    alignSelf: "stretch",
    marginBottom: 10,
  },
  mark: {
    borderLeftColor: "mediumpurple",
    borderLeftWidth: 5,
    padding: 10,

  },
})

export default withNavigation(ProjectItem);