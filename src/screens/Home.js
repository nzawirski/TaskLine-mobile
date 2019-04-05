import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Image } from 'react-native';
import DisplayUserName from '../components/DisplayUserName';

import { styles } from '../styles';
import { auth } from '../config';
import { firestore } from '../config';

export default class Home extends Component {

  logOut = () => {
    try {
      auth.signOut();
      // signed out
    } catch (e) {
      // an error
    }
  }

  state = {
    nick: "",
    icon: "",
  };

  componentDidMount(){
    firestore.collection("Users").doc(auth.currentUser.uid).onSnapshot((doc)=>{
    this.setState({ 
      nick: doc.data().nick,
      email: doc.data().email,
      icon: doc.data().icon,
    });
  })
  }

  render() {
    return (
      <View style={{flex:1}}>
        <View style={styles.projectsView}>
          <Text style={styles.title}> Welcome {this.state.nick} !</Text>
          
          < Image
            style={{width: 100, height: 100, justifyContent: "center", alignItems: "center"}}
            source={{uri: this.state.icon}}
          />

          <Text> Email: {this.state.email}</Text> 
          <TouchableHighlight
            style={styles.button}
            onPress={this.logOut}
            underlayColor={"lavender"}>
            <Text  style={styles.buttonText}>Log Out</Text>
          </TouchableHighlight>
        </View>
        <View style={{flex:4, backgroundColor: "mediumpurple"}}>
        </View>
      </View>
    );
  }
}
