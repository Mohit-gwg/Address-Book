import React, { Component } from 'react'
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet, ToastAndroid, I18nManager } from 'react-native';
import { UIConstants } from '../../AdressBook/screens/staticFile';
import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize";
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';

const translationGetters = {
    en: () => require("../../AdressBook/common/languageSupport/en.json"),
    id: () => require("../../AdressBook/common/languageSupport/id.json")
};

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key)
);

const setI18nConfig = () => {
    const fallback = { languageTag: "en", isRTL: false };
    const { languageTag, isRTL } =
        RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
        fallback;
    translate.cache.clear();
    I18nManager.forceRTL(isRTL);
    i18n.translations = { [languageTag]: translationGetters[languageTag]() };
    AsyncStorage.setItem('@currentLanguage', languageTag);
    i18n.locale = languageTag;
};

class AddUserDetails extends Component {

    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        setI18nConfig();
        this.state = {
            isLanguage: '',
            addEmail: '',
            addName: '',
            addPhone: 0,
            chooseGender: 0,
        }
    }
    componentDidMount() {
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
        AsyncStorage.getItem("@currentLanguage").then(isLanguage => {
            this.setState({ isLanguage: isLanguage })
        });
    }
    componentWillUnmount() {
        RNLocalize.removeEventListener("change", this.handleLocalizationChange);
    }
    handleLocalizationChange = () => {
        setI18nConfig();
        this.forceUpdate();
    };
    addName = (addName) => {
        this.setState({ addName });
    }
    addPhone = (addPhone) => {
        this.setState({ addPhone });
    }
    addEmail = (addEmail) => {
        this.setState({ addEmail });
    }
    goToContactListScreen = () => {
        if (this.state.addName != "" && this.state.addEmail != "" && this.state.addPhone != 0) {
            AsyncStorage.setItem('@userName', this.state.addName);
            AsyncStorage.setItem('@userEmail', this.state.addEmail);
            AsyncStorage.setItem('@userPhoneNumber', this.state.addPhone.toString());
            AsyncStorage.setItem('@userGender', this.state.chooseGender.toString());
            this.props.navigation.navigate('ContactLists');
        }
        else {
            ToastAndroid.showWithGravity(
                translate("Pleaseenterallthedetails!"),
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
        }
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
        const { isLanguage } = this.state;
        const { chooseGender } = this.state;
        return (
            <LinearGradient
                colors={['rgb(255,129,62)', '#ff8a80']}
                start={{ x: 0.50, y: 0.50 }} end={{ x: 0.8, y: 0.90 }}
                style={styles.mainContainer}>
                <ScrollView>
                    <Text style={styles.headlineTitle}>{translate("WelcomeTo")}</Text>
                    <Text style={styles.subHeadlineTitle}>{translate("AddressBook")}</Text>
                    <View style={styles.userRegistrationContainer}>
                        <Text style={styles.addDetialText}>{translate("AddDetails")}</Text>

                        <View style={styles.userRegistrationMainContainer}>
                            <View style={styles.fillDetailsMainView}>
                                <Text style={styles.fillDetailsTitleText}>{translate("Name")}</Text>
                                <TextInput
                                    style={styles.fillDetailsTextInput}
                                    placeholderTextColor={'rgba(36,39,80,0.54)'}
                                    maxHeight={40}
                                    placeholder={`${translate("Addname")}`}
                                    onChangeText={text => this.addName(text)}
                                    value={addName}
                                />
                            </View>
                            <View
                                style={styles.textInputBottomLine}
                            />
                            <View style={styles.fillDetailsMainView}>
                                <Text style={isLanguage == "id" ? styles.fillGenderTitleTextIndonessia : styles.fillGenderTitleText}>{translate("Gender")}</Text>
                                <TouchableOpacity style={chooseGender == 0 ? styles.heighllightGenderView : styles.simpleGenderView} onPress={() => chooseGender == 0 ? this.setState({ chooseGender: 1 }) : this.setState({ chooseGender: 0 })}>
                                    <Text style={chooseGender == 0 ? styles.heightlightGenderText : styles.simpleGenderText}>{translate("Male")}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={chooseGender == 0 ? styles.simpleGenderView : styles.heighllightGenderView} onPress={() => chooseGender == 1 ? this.setState({ chooseGender: 0 }) : this.setState({ chooseGender: 1 })}>
                                    <Text style={chooseGender == 0 ? styles.simpleGenderText : styles.heightlightGenderText}>{translate("Female")}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.fillDetailsMainView}>
                                <Text style={styles.fillDetailsTitleText}>{translate("Phone")}</Text>
                                <TextInput
                                    style={styles.fillDetailsTextInput}
                                    placeholderTextColor={'rgba(36,39,80,0.54)'}
                                    maxHeight={40}
                                    keyboardType={"number-pad"}
                                    placeholder={`${translate("Addphonenumber")}`}
                                    onChangeText={text => this.addPhone(text)}
                                    value={addPhone}
                                />
                            </View>
                            <View
                                style={styles.textInputBottomLine}
                            />
                            <View style={styles.fillDetailsMainView}>
                                <Text style={styles.fillDetailsTitleText}>{translate("Email")}</Text>
                                <TextInput
                                    style={styles.fillDetailsTextInput}
                                    placeholderTextColor={'rgba(36,39,80,0.54)'}
                                    maxHeight={40}
                                    placeholder={`${translate("Addemail")}`}
                                    onChangeText={text => this.addEmail(text)}
                                    value={addEmail}
                                />
                            </View>
                            <View
                                style={styles.textInputBottomLine}
                            />
                        </View>

                    </View>
                    <View style={styles.userImageMainView}>
                        <Image style={styles.userImage} source={images.girlImage} />
                    </View>
                    <TouchableOpacity style={styles.nextButtonView} onPress={() => this.goToContactListScreen()}>
                        <Text style={styles.nextButtonText}>{translate("Next")}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        );
    }
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    headlineTitle: {
        color: '#fff',
        fontFamily: 'CircularStd-Book',
        fontSize: UIConstants.vw * 22,
        alignSelf: 'center',
        marginTop: UIConstants.vw * 24
    },
    subHeadlineTitle: {
        color: '#fff',
        fontFamily: 'CircularStd-Book',
        fontSize: UIConstants.vw * 22,
        alignSelf: 'center',
        marginTop: UIConstants.vw * 2
    },
    userRegistrationMainContainer: {
        alignItems: 'center',
        transform: [{ rotate: '-1.8deg' }],
    },
    userRegistrationContainer: {
        alignItems: 'center',
        height: UIConstants.vw * 400,
        borderRadius: UIConstants.vw * 16,
        backgroundColor: '#fff',
        transform: [{ rotate: '2deg' }],
        alignSelf: 'stretch',
        marginTop: UIConstants.vw * 70,
        marginLeft: UIConstants.vw * 24,
        marginRight: UIConstants.vw * 24
    },
    addDetialText: {
        color: 'rgba(36,39,80,0.96)',
        fontFamily: 'CircularStd-Book',
        fontSize: UIConstants.vw * 20,
        marginTop: UIConstants.vw * 24,
        alignSelf: 'center',
        transform: [{ rotate: '-1.8deg' }],
        fontWeight: 'bold'
    },
    fillDetailsMainView: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: UIConstants.vw * 32,
        marginLeft: UIConstants.vw * 24,
        alignSelf: 'flex-start'
    },
    fillDetailsTitleText: {
        color: 'rgba(36,39,80,0.96)',
        fontFamily: 'CircularStd-Book',
        fontSize: UIConstants.vw * 20,
        fontWeight: 'bold'
    },
    fillGenderTitleText: {
        color: 'rgba(36,39,80,0.96)',
        fontFamily: 'CircularStd-Book',
        fontSize: UIConstants.vw * 20,
        fontWeight: 'bold',
        marginRight: UIConstants.vw * 30,
    },
    fillGenderTitleTextIndonessia: {
        color: 'rgba(36,39,80,0.96)',
        fontFamily: 'CircularStd-Book',
        fontSize: UIConstants.vw * 20,
        fontWeight: 'bold',
        marginRight: UIConstants.vw * 10,
    },
    fillDetailsTextInput: {
        fontFamily: 'CircularStd-Book',
        width: '70%',
        marginLeft: UIConstants.vw * 34
    },
    textInputBottomLine: {
        height: UIConstants.vw * 2,
        width: '64%',
        backgroundColor: 'rgb(255,129,62)',
        alignSelf: 'flex-end',
        marginRight: UIConstants.vw * 24
    },
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
        paddingLeft: UIConstants.vw * 14,
        paddingRight: UIConstants.vw * 14
    },
    userImageMainView: {
        height: UIConstants.vw * 110,
        width: UIConstants.vw * 110,
        backgroundColor: '#fff',
        borderRadius: UIConstants.vw * 110 / 2,
        position: 'absolute',
        top: UIConstants.vw * 80,
        left: UIConstants.vw * 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: UIConstants.vw * 8,
        borderColor: '#fff',
        elevation: UIConstants.vw * 4
    },
    userImage: {
        width: UIConstants.vw * 100,
        height: UIConstants.vw * 100,
        borderRadius: UIConstants.vw * 100 / 2
    },
    nextButtonView: {
        height: UIConstants.vw * 40,
        width: UIConstants.vw * 120,
        backgroundColor: '#fff',
        elevation: UIConstants.vw * 2,
        borderRadius: UIConstants.vw * 16,
        marginTop: UIConstants.vw * 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: UIConstants.vw * 4
    },
    nextButtonText: {
        color: '#000',
        fontFamily: 'CircularStd-Book',
        fontSize: UIConstants.vw * 20,
        fontWeight: 'bold'
    },



});
export default AddUserDetails;
