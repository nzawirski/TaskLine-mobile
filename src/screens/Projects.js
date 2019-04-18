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
import ProjectItem from "../components/ProjectItem";

import { auth, firestore } from "../config";

export default class Projects extends Component {
  state = {
    projects: [],
    loading: true
  };

  componentDidMount() {
    firestore
      .collection("Projects")
      .where("Users", "array-contains", auth.currentUser.uid)
      .onSnapshot(projs => {
        let projects = [];
        projs.forEach(doc => {
          projects.push({
            id: doc.id,
            name: doc.data().Name
          });
        });
        this.setState({ projects, loading: false });
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

    projects = this.state.projects;

    return (
      <ThemeProvider theme={theme}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Projects:</Text>
          </View>

          <View style={{ flex: 8 }}>
            <FlatList
              data={projects}
              renderItem={({ item }) => (
                <ProjectItem projectId={item.id} projectName={item.name} />
              )}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              buttonStyle={{
                marginHorizontal: 10
              }}
              icon={<Icon name="plus" size={15} color="white" />}
              onPress={() => this.props.navigation.navigate("AddProjectScreen")}
              title=" Add project"
            />
          </View>
        </View>
      </ThemeProvider>
    );
  }
}
