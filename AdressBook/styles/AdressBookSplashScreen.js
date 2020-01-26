import { StyleSheet } from 'react-native';
import { UIConstants } from '../../AdressBook/screens/staticFile';

export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#009688'
    },
    imageBackground: {
        width: UIConstants.vw * 80,
        height: UIConstants.vw * 80
    },
    titleText: {
        color: '#fff',
        fontFamily: 'CircularStd-Book',
        fontSize: UIConstants.vw * 22,
        marginTop: UIConstants.vw * 16,
        fontWeight: 'bold'
    },
});