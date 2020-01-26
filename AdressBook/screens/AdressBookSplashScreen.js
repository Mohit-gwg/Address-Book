import React, { Component } from 'react'
import { View, Text, Image, Animated, I18nManager } from 'react-native';
import styles from '../../AdressBook/styles/AdressBookSplashScreen';
import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize";

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
    i18n.locale = languageTag;
};

class AdressBookSplashScreen extends Component {

    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        setI18nConfig();
        this.state = {
            fadeAmin: new Animated.Value(0),
        }
    }
    componentDidMount() {
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
        Animated.timing(
            this.fadeAnim = new Animated.Value(0),
            {
                toValue: 0,
                duration: 2000,
            }
        ).start(() => {
            this.props.navigation.navigate('AddUserDetails');
            setTimeout(() => {
                this.fadeAnim = new Animated.Value(1);
            }, 5000);
        });
    }
    componentWillUnmount() {
        RNLocalize.removeEventListener("change", this.handleLocalizationChange);
    }
    handleLocalizationChange = () => {
        setI18nConfig();
        this.forceUpdate();
    };
    render() {
        const images = {
            backGroundImage: require('../../AdressBook/images/phoneBackground.png'),
        }
        return (
            <View style={styles.mainContainer}>
                <Image style={styles.imageBackground} source={images.backGroundImage} />
                <Text style={styles.titleText}>{translate("Phone")}</Text>
            </View>
        );
    }
}
export default AdressBookSplashScreen;
