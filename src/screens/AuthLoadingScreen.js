import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { auth } from '../config';



export default class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        
        this.props.navigation.navigate(auth.currentUser ? 'App' : 'Auth');
    }

    // Render any loading content that you like here
    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}