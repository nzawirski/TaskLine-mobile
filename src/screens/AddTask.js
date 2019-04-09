import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';

import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import 'moment/locale/en-gb'

import { styles } from '../styles';
import { firestore } from '../config';
import { auth } from '../config';


export default class AddTask extends Component {
  state = {
    taskName: '',
    dueDate: new Date(),
    isDateTimePickerVisible: false,
  };

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    this.setState({ 
      dueDate: new Date(date)
    });
    this._hideDateTimePicker();
  };

  handleSubmit = () => {
    const { navigation } = this.props;
    const projectId = navigation.getParam('projectId', null);
    // todo: assigning users
    firestore.collection("Tasks").add({
      Name: this.state.taskName,
      DateAdded: new Date(),
      DueDate: this.state.dueDate,
      ProjectId: projectId,
      Users: [auth.currentUser.uid],
      AddedBy: auth.currentUser.uid
    }).then(() => this.props.navigation.goBack())
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.projectsView}>
          {/* Task name */}
          <Text style={styles.title}>
            Task Name:
          </Text>
          <TextInput
            style={styles.itemInput}
            onChangeText={(taskName) => this.setState({ taskName })}
            selectionColor={"purple"}
          />
          {/* Due date */}
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              Due Date:
            </Text>
            <Text style={{color: 'mediumpurple'}}>
              {moment(this.state.dueDate).format('LLL')}
            </Text>
            <TouchableHighlight
              style={styles.buttonPale}
              onPress={this._showDateTimePicker}>
              <Text style={styles.buttonText}>Select Date</Text>
            </TouchableHighlight>
            <DateTimePicker
              mode={'datetime'}
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
            />
          </View>
          {/* Buttons */}
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleSubmit}
            underlayColor={"lavender"}>
            <Text style={styles.buttonText}>Add Task</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.button2}
            onPress={() => this.props.navigation.goBack()}
            underlayColor={"lavender"}>
            <Text style={styles.buttonText}>Dismiss</Text>
          </TouchableHighlight>

        </View>
      </View>
    );
  }
}


