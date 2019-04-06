import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Image, ScrollView } from 'react-native';
import ChangeLogItem from '../components/ChangeLogItem';

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
    msgs: [],
  };

  componentDidMount(){
    firestore.collection("Users").doc(auth.currentUser.uid).onSnapshot((doc)=>{
    this.setState({ 
      nick: doc.data().nick,
      email: doc.data().email,
      icon: doc.data().icon,
    });
    })

    firestore.collection("Messages").onSnapshot((query)=>{
      let msgs=[];
      query.forEach((doc)=>msgs.push(doc.data().msg));
      this.setState({ msgs });
    })
  }

  render() {

    let msgs = [];
    this.state.msgs.forEach((i)=>msgs.push(<ChangeLogItem msg={i}></ChangeLogItem>));

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
        <View style={{flex:4, backgroundColor: "#fff"}}><ScrollView>{msgs}</ScrollView></View>
      </View>
    );
  }
}
