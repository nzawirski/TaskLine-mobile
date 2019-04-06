import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
} from 'react-native';

import { styles } from '../styles';
import { firestore } from '../config';
import {auth} from '../config';

export default class AddUser extends Component {
  state = {
    umail: ''
  };

    handleSubmit = () => {
        const { navigation } = this.props;
        const projectId = navigation.getParam('projectId', null);

        let uid = "";
        let users = [];

        firestore.collection("Users").where("email","==",this.state.umail).get().then((snap)=>{
            snap.forEach((doc)=>{
                uid = doc.id;
            })
        }).then(()=> {

            firestore.collection("Projects").doc(projectId).get().then((doc2)=>{
                    users = doc2.data().Users;
                    users.push(uid);
                
            }).then(()=> {
                firestore.collection("Projects").doc(projectId).update({
                    Users: users,
                })
            });
        })
        
    };

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.projectsView}>
          <Text style={styles.title}>User email:</Text>
          <TextInput 
            style={styles.itemInput} 
            onChangeText={(umail) => this.setState({umail})} 
            selectionColor={"purple"}
          />

        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit}
          underlayColor={"lavender"}>
          <Text style={styles.buttonText}>Add User</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.button}
          onPress={() => this.props.navigation.goBack()}
          underlayColor={"lavender"}>
          <Text style={styles.buttonText}>Dismiss</Text>
        </TouchableHighlight>
          
        </View>
      </View>
    );
  }
}


