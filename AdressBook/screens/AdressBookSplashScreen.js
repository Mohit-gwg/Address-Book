import React, { Component } from 'react'
import { ImageBackground, View, Text } from 'react-native';
import styles from '../../AdressBook/styles/AdressBookSplashScreen';

class AdressBookSplashScreen extends Component {

    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        this.props.navigation.navigate('ContactLists');
    }
    render() {
        const images = {
            // backGroundImage: require('../../AdressBook/images/phone_background.jpg'),
        }
        return (
            <View style={styles.mainContainer}>
                <Text>Splash Screen</Text>
            </View>
        );
    }
}
export default AdressBookSplashScreen;
