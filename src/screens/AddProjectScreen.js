import React, { Component } from 'react';
import {
  View,
  Keyboard,
  FlatList,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeProvider } from 'react-native-elements';

import { styles, theme } from '../styles';
import { firestore } from '../config';
import { auth } from '../config';
import UserItem from '../components/UserItem'

export default class AddProjectScreen extends Component {
  state = {
    projectName: '',
    userSearch: '',
    allUsers: [],
    chosenUsers: [],
    keyboard: false,
    loading: true,
  };

  handleSubmit = () => {
    firestore.collection("Projects").add({
      Name: this.state.projectName,
      Date: new Date(),
      Users: [auth.currentUser.uid]
    }).then(() => this.props.navigation.goBack())
  };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      ()=>{this.setState({keyboard: true})},
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      ()=>{this.setState({keyboard: false})},
    );

    firestore.collection("Users").onSnapshot((doc) => {
      let users = [];
      doc.forEach((user) => {
        users.push({userId: user.id,
           nick: user.data().nick,
           email: user.data().email,
          })
      })
      this.setState({ allUsers: users, loading: false, })
      
    })
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  smth = () => {
    if (this.state.keyboard==false) {
      return(
        <View style={styles.buttonContainer}>
              <Button
                buttonStyle={{
                  marginHorizontal: 10
                }}
                icon={
                  <Icon
                    name="window-close"
                    size={15}
                    color="white"
                  />
                }
                onPress={() => this.props.navigation.goBack()}
                title="Dismiss">
              </Button>

              <Button
                buttonStyle={{
                  marginHorizontal: 10
                }}
                icon={
                  <Icon
                    name="check-circle"
                    size={15}
                    color="white"
                  />
                }
                onPress={this.handleSubmit}
                title="Add Project">
              </Button>
              </View>
      )
    }
  }

  render() {
    if (this.state.loading) {
      return null; // or render a loading icon
    } 
    let n = this.state.allUsers;

    if(this.state.userSearch!=""){
      n = n.filter((user)=>{
        return user.nick.toLowerCase().includes(this.state.userSearch.toLowerCase());
      });
    }
    console.log(n);
    return (
      <ThemeProvider theme={theme}>
        <View style={{flex: 1}}>

            <Input
              label="Project name"
              onChangeText={(projectName) => this.setState({ projectName })}
              selectionColor={"purple"}
            />

            <Input
              label="Add collaborators"
              onChangeText={(userSearch) => this.setState({ userSearch })}
              selectionColor={"purple"}
            />

            <View style={{ flex: 1, marginVertical: 5 }}>
            <FlatList 
              data={n} 
              renderItem={({item})=><UserItem nick={item.nick} email={item.email}></UserItem>} 
            /></View>

            {this.smth()}
        </View>
      </ThemeProvider>
    );
  }
}


