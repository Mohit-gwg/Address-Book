import React, { Component } from 'react'
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { UIConstants } from '../../AdressBook/screens/staticFile';
import LinearGradient from 'react-native-linear-gradient';

class AddUserDetails extends Component {

    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            addEmail: '',
            addName: '',
            addPhone: 0,
            chooseGender: 0,
        }
    }
    addName = (addName) => {
        this.setState({ addName });
    }
    addPhone = (addPhone) => {
        this.setState({ addPhone });
    }
    addEmail = (addEmail) => {
        this.setState({ addEmail });
    }
    render() {
        const images = {
            phoneImage: require('../../AdressBook/images/phone.png'),
            emailImage: require('../../AdressBook/images/mail.png'),
            girlImage: require('../../AdressBook/images/girl.png'),
        }
        const { addEmail } = this.state;
        const { addName } = this.state;
        const { addPhone } = this.state;
        const { chooseGender } = this.state;
        return (
            <LinearGradient
                colors={['rgb(255,129,62)', '#ff8a80']}
                start={{ x: 0.50, y: 0.50 }} end={{ x: 0.8, y: 0.90 }}
                style={{ flex: 1, }}>
                <ScrollView>

                    <Text style={{ color: '#fff', fontFamily: 'CircularStd-Book', fontSize: UIConstants.vw * 22, alignSelf: 'center', marginTop: UIConstants.vw * 24 }}>Welcome To</Text>
                    <Text style={{ color: '#fff', fontFamily: 'CircularStd-Book', fontSize: UIConstants.vw * 22, alignSelf: 'center', marginTop: UIConstants.vw * 2 }}>Address Book</Text>
                    <View style={{ alignItems: 'center', height: UIConstants.vw * 400, borderRadius: UIConstants.vw * 16, backgroundColor: '#fff', transform: [{ rotate: '2deg' }], alignSelf: 'stretch', marginTop: UIConstants.vw * 70, marginLeft: UIConstants.vw * 24, marginRight: UIConstants.vw * 24 }}>
                        <Text style={{ color: 'rgba(36,39,80,0.96)', fontFamily: 'CircularStd-Book', fontSize: UIConstants.vw * 20, marginTop: UIConstants.vw * 24, alignSelf: 'center', fontWeight: 'bold' }}>Add Details</Text>

                        <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: UIConstants.vw * 32, marginLeft: UIConstants.vw * 24, alignSelf: 'flex-start' }}>
                            <Text style={{ color: 'rgba(36,39,80,0.96)', fontFamily: 'CircularStd-Book', fontSize: UIConstants.vw * 20, fontWeight: 'bold' }}>Name</Text>
                            <TextInput
                                style={{ fontFamily: 'CircularStd-Book', width: '70%', marginLeft: UIConstants.vw * 34 }}
                                placeholderTextColor={'rgba(36,39,80,0.54)'}
                                maxHeight={40}
                                placeholder={'Add name'}
                                onChangeText={text => this.addName(text)}
                                value={addName}
                            />
                        </View>
                        <View
                            style={{ height: UIConstants.vw * 2, width: '64%', backgroundColor: 'rgb(255,129,62)', alignSelf: 'flex-end', marginRight: UIConstants.vw * 24 }}
                        />

                        <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: UIConstants.vw * 32, marginLeft: UIConstants.vw * 24, alignSelf: 'flex-start' }}>
                            <Text style={{ color: 'rgba(36,39,80,0.96)', fontFamily: 'CircularStd-Book', fontSize: UIConstants.vw * 20, fontWeight: 'bold', marginRight: UIConstants.vw * 30, }}>Gender</Text>
                            <TouchableOpacity style={chooseGender == 0 ? styles.heighllightGenderView : styles.simpleGenderView} onPress={() => chooseGender == 0 ? this.setState({ chooseGender: 1 }) : this.setState({ chooseGender: 0 })}>
                                <Text style={chooseGender == 0 ? styles.heightlightGenderText : styles.simpleGenderText}>Male</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={chooseGender == 0 ? styles.simpleGenderView : styles.heighllightGenderView} onPress={() => chooseGender == 1 ? this.setState({ chooseGender: 0 }) : this.setState({ chooseGender: 1 })}>
                                <Text style={chooseGender == 0 ? styles.simpleGenderText : styles.heightlightGenderText}>Female</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: UIConstants.vw * 32, marginLeft: UIConstants.vw * 24, alignSelf: 'flex-start' }}>
                            <Text style={{ color: 'rgba(36,39,80,0.96)', fontFamily: 'CircularStd-Book', fontSize: UIConstants.vw * 20, fontWeight: 'bold' }}>Phone</Text>
                            <TextInput
                                style={{ fontFamily: 'CircularStd-Book', width: '70%', marginLeft: UIConstants.vw * 34 }}
                                placeholderTextColor={'rgba(36,39,80,0.54)'}
                                maxHeight={40}
                                placeholder={'Add phone number'}
                                onChangeText={text => this.addPhone(text)}
                                value={addPhone}
                            />
                        </View>
                        <View
                            style={{ height: UIConstants.vw * 2, width: '64%', backgroundColor: 'rgb(255,129,62)', alignSelf: 'flex-end', marginRight: UIConstants.vw * 24 }}
                        />

                        <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: UIConstants.vw * 32, marginLeft: UIConstants.vw * 24, alignSelf: 'flex-start' }}>
                            <Text style={{ color: 'rgba(36,39,80,0.96)', fontFamily: 'CircularStd-Book', fontSize: UIConstants.vw * 20, fontWeight: 'bold' }}>Email</Text>
                            <TextInput
                                style={{ fontFamily: 'CircularStd-Book', width: '70%', marginLeft: UIConstants.vw * 34 }}
                                placeholderTextColor={'rgba(36,39,80,0.54)'}
                                maxHeight={40}
                                placeholder={'Add Email'}
                                onChangeText={text => this.addEmail(text)}
                                value={addEmail}
                            />
                        </View>
                        <View
                            style={{ height: UIConstants.vw * 2, width: '64%', backgroundColor: 'rgb(255,129,62)', alignSelf: 'flex-end', marginRight: UIConstants.vw * 24 }}
                        />

                    </View>
                    <View style={{ height: UIConstants.vw * 110, width: UIConstants.vw * 110, backgroundColor: '#fff', borderRadius: UIConstants.vw * 110 / 2, position: 'absolute', top: UIConstants.vw * 80, left: UIConstants.vw * 10, justifyContent: 'center', alignItems: 'center', borderWidth: UIConstants.vw * 8, borderColor: '#fff', elevation: UIConstants.vw * 4 }}>
                        <Image style={{ width: UIConstants.vw * 100, height: UIConstants.vw * 100, borderRadius: UIConstants.vw * 100 / 2 }} source={images.girlImage} />
                    </View>

                    <TouchableOpacity style={{ height: UIConstants.vw * 40, width: UIConstants.vw * 120, backgroundColor: 'rgb(255,129,62)', elevation: UIConstants.vw * 2, borderRadius: UIConstants.vw * 16, marginTop: UIConstants.vw * 42, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <Text style={{ color: '#fff', fontFamily: 'CircularStd-Book', fontSize: UIConstants.vw * 20, fontWeight: 'bold' }}>Next</Text>
                    </TouchableOpacity>
                </ScrollView>

            </LinearGradient>
        );
    }
}
const styles = StyleSheet.create({
    heighllightGenderView: {
        height: UIConstants.vw * 30,
        marginRight: UIConstants.vw * 6,
        marginLeft: UIConstants.vw * 12,
        borderRadius: UIConstants.vw * 14,
        backgroundColor: 'rgb(255,129,62)',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: UIConstants.vw * 2
    },
    simpleGenderView: {
        height: UIConstants.vw * 30,
        borderRadius: UIConstants.vw * 14,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: UIConstants.vw * 6,
        elevation: UIConstants.vw * 2,
        borderWidth: UIConstants.vw * 1,
        borderColor: "rgba(36, 39, 80, 0.96)"
    },
    heightlightGenderText: {
        color: '#fff',
        fontFamily: 'CircularStd-Book',
        fontSize: UIConstants.vw * 14,
        paddingTop: UIConstants.vw * 16,
        paddingBottom: UIConstants.vw * 16,
        paddingLeft: UIConstants.vw * 18,
        paddingRight: UIConstants.vw * 18
    },
    simpleGenderText: {
        color: 'rgba(36,39,80,0.96)',
        fontFamily: 'CircularStd-Book',
        fontSize: UIConstants.vw * 14,
        paddingTop: UIConstants.vw * 16,
        paddingBottom: UIConstants.vw * 16,
        paddingLeft: UIConstants.vw * 18,
        paddingRight: UIConstants.vw * 18
    },

});
export default AddUserDetails;
