import React, { Component } from 'react'
import { View, Text, Image, Animated } from 'react-native';
import { UIConstants } from '../../AdressBook/screens/staticFile';
import styles from '../../AdressBook/styles/AdressBookSplashScreen';

class AdressBookSplashScreen extends Component {

    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            fadeAmin: new Animated.Value(0),
        }
    }

    componentDidMount() {
        Animated.timing(
            this.fadeAnim = new Animated.Value(0),
            {
                toValue: 0,
                duration: 2000,
            }
        ).start(() => {
            this.props.navigation.navigate('ContactLists');
            setTimeout(() => {
                this.fadeAnim = new Animated.Value(1);
            }, 5000);
        });
    }
    render() {
        const images = {
            backGroundImage: require('../../AdressBook/images/phoneBackground.png'),
        }
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#009688' }}>
                <Image style={{ width: UIConstants.vw * 80, height: UIConstants.vw * 80 }} source={images.backGroundImage} />
                <Text style={{ color: '#fff', fontFamily: 'CircularStd-Book', fontSize: UIConstants.vw * 22, marginTop: UIConstants.vw * 16, fontWeight: 'bold' }}>Phone</Text>
            </View>
        );
    }
}
export default AdressBookSplashScreen;
