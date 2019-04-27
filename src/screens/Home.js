import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StatusBar
} from "react-native";

import { Button } from "react-native-elements";
import { ThemeProvider } from "react-native-elements";

import Icon from "react-native-vector-icons/FontAwesome";

import { styles, theme } from "../styles";
import ChangeLogItem from "../components/ChangeLogItem";

import { auth, firestore } from "../config";
import moment from "moment";
import "moment/locale/en-gb";
export default class Home extends Component {
  logOut = () => {
    try {
      auth.signOut();
      // signed out
    } catch (e) {
      // an error
    }
  };

  state = {
    nick: "",
    logs: [],
    loading: true
  };

  componentDidMount() {
    firestore
      .collection("Users")
      .doc(auth.currentUser.uid)
      .onSnapshot(doc => {
        this.setState({
          nick: doc.data().nick
        });
      });

    firestore
      .collection("Changes")
      .where("Users", "array-contains", auth.currentUser.uid)
      .orderBy("When","desc")
      .onSnapshot(query => {
        let logs = [];
        query.forEach(doc =>
          logs.push({
            who: doc.data().Who,
            did: doc.data().Did,
            what: doc.data().What,
            when: doc.data().When
          })
        );
        this.setState({ logs, loading: false });
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <View>
          <ActivityIndicator />
          <StatusBar barStyle="default" />
        </View>
      );
    }

    logs = this.state.logs;

    return (
      <ThemeProvider theme={theme}>
        <View style={styles.main}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              {" "}
              Welcome{" "}
              <Text style={{ color: "mediumpurple" }}>{this.state.nick}</Text>!
            </Text>

            <View style={styles.buttonContainer}>
              <Button
                buttonStyle={{
                  marginHorizontal: 10
                }}
                icon={<Icon name="sign-out" size={15} color="white" />}
                onPress={this.logOut}
                title=" Log Out"
              />
            </View>
          </View>

          <View style={{ flex: 4, marginTop: 20 }}>
            <FlatList
              data={logs}
              renderItem={({ item }) => (
                <ChangeLogItem who={item.who} did={item.did} what={item.what} when={item.when.seconds * 1000} />
              )}
            />
          </View>
        </View>
      </ThemeProvider>
    );
  }
}
