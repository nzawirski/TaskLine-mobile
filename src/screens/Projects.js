import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import ProjectItem from '../components/ProjectItem';

import { styles } from '../styles';
import { auth } from '../config';
import { firestore } from '../config';



export default class Projects extends Component {
  state = {
    projects: []
  };

  componentDidMount(){
    firestore.collection("Projects").where("Users", "array-contains",auth.currentUser.uid).onSnapshot((projs)=>{
    let projects=[];
    projs.forEach((doc)=>projects.push(doc.data().Name));
    this.setState({ projects });
  })
  }

  handleSubmit = () => {
    addItem(this.state.name);
  };

  render() {
    let projs = [];
    this.state.projects.forEach((i)=>projs.push(<ProjectItem projectName={i}></ProjectItem>));

  
    return (
      <View style={{flex: 1}}>
      <View style={{flex: 1}}><Text style={styles.title}>Projects:</Text></View>

      <View style={{flex: 5}}><ScrollView>{projs}</ScrollView></View>
        <View style={styles.purple}>
        <TouchableHighlight
          style={styles.button2}
          onPress={() => this.props.navigation.navigate('AddProjectScreen')}
          underlayColor={"lavender"}>
          <Text style={styles.buttonText}>Add project</Text>
        </TouchableHighlight>
        </View>
      </View>
    );
  }
}


