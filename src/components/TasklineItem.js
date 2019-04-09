import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { withNavigation } from 'react-navigation';


class TasklineItem extends React.Component {


    render() {

    return (
        <View style={styles.box}>
            <View style={styles.disp}><Text style={styles.text}>{this.props.taskName}</Text></View>
            <View style={[styles.middle, {backgroundColor: this.props.taskColor,}]}></View>
            <View style={styles.disp}><Text style={styles.text}>{this.props.taskDue}</Text></View>
        </View>
    );
  }
};

const styles = StyleSheet.create({
    box: {
        alignSelf: "stretch",
        flexDirection: "row",
    },
    text:{
        textAlign: "center",
    },

    disp:{
        flex: 1,
        paddingTop: 20,
        paddingBottom: 20,
        padding: 5,
    },

    middle:{
        width: 2,
    },
})

export default withNavigation(TasklineItem);