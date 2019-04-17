import React, { Component } from 'react';
import { TouchableHighlight, View, Text, ScrollView, FlatList, ActivityIndicator, StatusBar, } from 'react-native';

import { Button } from 'react-native-elements';
import { ThemeProvider } from 'react-native-elements';

import Icon from 'react-native-vector-icons/FontAwesome';

import { styles, theme } from '../styles';
import TaskItem from '../components/TaskItem';

import { firestore } from '../config';
import moment from 'moment';
import 'moment/locale/en-gb'


export default class Board extends Component {

  state = {
    pid: "",
    projectName: "",
    users: [],
    tasks: [],
    loading: true,
  }

  componentDidMount() {
    //Get passed params and provide fallback value
    const { navigation } = this.props;
    const projectId = navigation.getParam('projectId', null);

    this.setState({ pid: projectId });

    firestore.collection("Projects").doc(projectId).onSnapshot((doc) => {
      this.setState({
        projectName: doc.data().Name,
        users: doc.data().Users
      });
    })

    firestore.collection("Tasks").where("ProjectId", "==", projectId).orderBy("DueDate", "desc").onSnapshot((doc) => {
      let tasks = [];
      doc.forEach((task) => tasks.push([task.id,
      task.data().Name,
      task.data().DateAdded,
      task.data().DueDate,
      task.data().AddedBy,
      task.data().Users
      ]));
      this.setState({ tasks: tasks, loading: false })
    })
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

    let userList = [];
    this.state.users.forEach((i) => { userList.push(<Text>U: {i}</Text>) })

    let taskList = [];
    this.state.tasks.forEach((i) => {

      let today = new Date();
      let dueDate = new Date(i[3].seconds * 1000);

      let fourDays = 1000 * 60 * 60 * 24 * 4
      let month = 1000 * 60 * 60 * 24 * 28

      let dD = moment(dueDate).fromNow();
      let timeUntil = dueDate - today

      let timeNormalisedMonth = Math.round(((timeUntil) / month) * 510);
      let timeNormalisedFourDays = Math.round(((timeUntil) / fourDays) * 510);

      let red
      let green
      let blue

      if (dueDate < today) {
        red = 0
        green = 0
        blue = 0
      } else {
        if (timeUntil < fourDays) {
          red = (510 - timeNormalisedFourDays);
          green = 0
          blue = (0 + timeNormalisedFourDays) / 2;
        } else {
          red = 0
          green = (0 + timeNormalisedMonth);
          blue = (510 - timeNormalisedMonth);
        }
      }
      colorCode = "rgb(" + red.toString() + ", " + green.toString() + ", " + blue.toString() + ")";


      taskList.push(<TaskItem
        TaskId={i[0]}
        TaskName={i[1]}
        DateAdded={i[2]}
        DueDate={i[3]}
        AddedBy={i[4]}
        taskColor={colorCode}
      ></TaskItem>)
    })

    return (
      <ThemeProvider theme={theme}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 10, }}>
            <Text style={styles.title}>Project <Text style={{color: "mediumpurple"}}>{this.state.projectName}</Text></Text>
            {userList}
            <ScrollView contentContainerStyle={{flexDirection: "row", flexWrap: "wrap", }}>{taskList}</ScrollView>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              buttonStyle={{
                marginHorizontal: 10
              }}
              icon={
                <Icon
                  name="user-plus"
                  size={15}
                  color="white"
                />
              }
              onPress={() => this.props.navigation.navigate('AddUser', { projectId: this.state.pid })}
              title=" Add User">
            </Button>
            <Button
              buttonStyle={{
                marginHorizontal: 10
              }}
              icon={
                <Icon
                  name="plus-circle"
                  size={15}
                  color="white"
                />
              }
              onPress={() => this.props.navigation.navigate('AddTask', { projectId: this.state.pid })}
              title=" Add Task">
            </Button>
          </View>
        </View>
      </ThemeProvider>
    );
  }
}
