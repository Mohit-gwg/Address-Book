import React, { PureComponent } from 'react'
import { Text, View, TouchableOpacity, TextInput, I18nManager, Image, Animated, ActivityIndicator } from 'react-native';
import { UIConstants } from '../../AdressBook/screens/staticFile';
import styles from '../../AdressBook/styles/ContactLists';
import ContactFlatlist from '../../AdressBook/components/ContactFlatlist'
import ContactProfileModal from '../../AdressBook/components/ContactProfileModal';
import * as RNLocalize from "react-native-localize";
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { profileDetailModal, isNightModeActive } from '../../AdressBook/common/Actions/ContactProfileActions';
import i18n from "i18n-js";
import memoize from "lodash.memoize";

const HEADER_MAX_HEIGHT = UIConstants.vw * 130;
const HEADER_MIN_HEIGHT = UIConstants.vw * 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

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

class ContactLists extends PureComponent {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        setI18nConfig();
        this.state = {
            isNightModeActive: 0,
            isLoading: false,
            enteredText: '',
            showProfileDetailPoppup: false,
            scrollY: new Animated.Value(0),
            page: 1,
            searchContactName: '',
            allContactsData: [],
            page: 1,
        }
    }
    componentDidMount() {
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
        this.fetchContactData();
    }
    componentWillUnmount() {
        RNLocalize.removeEventListener("change", this.handleLocalizationChange);
    }
    selectedContactProfileData = (visible, selectedData) => {
        if (visible == true) {
            let selectedContactDetails = {
                profileImage: selectedData && selectedData.picture && selectedData.picture.large || '',
                firstName: selectedData && selectedData.name && selectedData.name.first || '',
                lastName: selectedData && selectedData.name && selectedData.name.last || '',
                age: selectedData && selectedData.dob && selectedData.dob.age || '',
                cell: selectedData.cell,
                landlineNumber: selectedData.phone,
                email: selectedData.email,
                street: selectedData && selectedData.location && selectedData.location.street.name || '',
                city: selectedData && selectedData.location && selectedData.location.city || '',
                state: selectedData && selectedData.location && selectedData.location.state || '',
                postalCode: selectedData && selectedData.location && selectedData.location.postcode || '',
            }
            this.props.profileDetailModal(selectedContactDetails);
            this.setState({ showProfileDetailPoppup: true });
        }
        else {
            this.setState({ showProfileDetailPoppup: false });
        }
    }
    handleLocalizationChange = () => {
        setI18nConfig();
        this.forceUpdate();
    };
    fetchContactData = () => {
        this.setState({ isLoading: true });
        fetch(`https://randomuser.me/api/?results=1000&page=${this.state.page}`).then((response) =>
            response.json()).then((responseData) => {
                this.setState({ allContactsData: [...this.state.allContactsData, ...responseData.results], isLoading: false });
            });
    }
    loadMoreContactData = () => {
        this.setState({
            page: this.state.page + 1,
        }, () => {
            this.fetchContactData();
        })
    }
    searchText = (enteredText) => {
        this.setState({ searchContactName: enteredText });
        let text = enteredText
        let allContactListsData = this.state.allContactsData
        let filteredName = allContactListsData.filter((item) => {
            return item.name.first.match(text)
        })
        if (!text || text === '') {
            this.setState({ page: 1 })
            this.fetchContactData();
        }
        else if (Array.isArray(filteredName)) {
            this.setState({
                allContactsData: filteredName
            })
        }
    }
    scrollToTop = () => {
        this._flatlist.scrollToOffset({ x: 845, y: 845, animated: true });
    }
    render() {
        //console.log("check redux stord data which pass through by reducers and taken by action = ", this.props.selectedContactDetails, "Night Mode = ", this.props.checkNightModeActive);
        const { allContactsData } = this.state;
        const { searchContactName } = this.state;
        const { showProfileDetailPoppup } = this.state;
        const { scrollY } = this.state;
        const { selectedContactDetails } = this.props;
        const { isLoading } = this.state;
        const { checkNightModeActive } = this.props;
        const images = {
            profileImage: require('../../AdressBook/images/user.png'),
            searchImage: require('../../AdressBook/images/search.png'),
            topArrowImage: require('../../AdressBook/images/upArrowNew.png'),
            girlImage: require('../../AdressBook/images/girl.png'),
            emailImage: require('../../AdressBook/images/mail.png'),
            phoneImage: require('../../AdressBook/images/phone.png'),
            addressImage: require('../../AdressBook/images/address.png'),
            spinImage: require('../../AdressBook/images/spinImage.png'),
            rotateArrow: require('../../AdressBook/images/rotateArrow.png'),
            phoneImageLoader: require('../../AdressBook/images/phoneBackground.png'),
            sunImage: require('../../AdressBook/images/sun.png'),
            moonImage: require('../../AdressBook/images/moon.png'),
        }
        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp',
        });
        const subViewOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp',
        });
        const subViewTranslate = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -50],
            extrapolate: 'clamp',
        });
        return (
            <View style={checkNightModeActive == 0 ? styles.mainContainer : styles.mainNightModeContainer}>
                <Animated.View style={[styles.mainHeader, { height: headerHeight }]}>
                    <View style={styles.subHeader}>
                        <TouchableOpacity style={styles.profileImageView}>
                            <Image style={styles.headerImages} source={images.profileImage} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{translate("allContacts")}</Text>
                        {
                            (checkNightModeActive == 1)
                                ?
                                (
                                    <TouchableOpacity style={styles.nightDayImageView} onPress={() => checkNightModeActive == 1 ? this.props.isNightModeActive(0) : this.props.isNightModeActive(1)}>
                                        <Image style={styles.headerImages} source={images.sunImage} />
                                    </TouchableOpacity>
                                )
                                :
                                (
                                    <TouchableOpacity style={styles.nightDayImageView} onPress={() => checkNightModeActive == 0 ? this.props.isNightModeActive(1) : this.props.isNightModeActive(0)}>
                                        <Image style={styles.headerImages} source={images.moonImage} />
                                    </TouchableOpacity>
                                )
                        }
                    </View>
                    <Animated.View style={[styles.searchBar, { opacity: subViewOpacity, transform: [{ translateY: subViewTranslate }] }]}>
                        <LinearGradient
                            colors={['#F8BBD0', '#F48FB1']}
                            start={{ x: 0.0, y: 0.6 }} end={{ x: 0.2, y: 0.80 }}
                            style={styles.searchImageView}
                        >
                            <Image style={styles.searchImage} source={images.searchImage} />
                        </LinearGradient>
                        <TextInput
                            style={styles.searchTextInput}
                            underlineColorAndroid='transparent'
                            placeholderTextColor={'#D6D4DC'}
                            maxHeight={40}
                            placeholder={`${translate("SearchContact")}`}
                            onChangeText={text => this.searchText(text)}
                            value={searchContactName}
                        />
                    </Animated.View>
                </Animated.View>
                {
                    (isLoading == true)
                        ?
                        (
                            <View style={styles.loaderMainView}>
                                <View style={styles.loaderChildView}>
                                    <View style={styles.phoneImageLoaderView}>
                                        <Image style={styles.phoneImageLoader} source={images.phoneImageLoader} />
                                    </View>
                                    <ActivityIndicator size="large" color="#E91E63" style={styles.loader} />
                                </View>
                            </View>
                        )
                        :
                        (
                            <>
                                <ContactFlatlist checkNightModeActive={checkNightModeActive} isLoading={isLoading} ref={r => this._flatlist = r} scrollY={scrollY} loadMoreContactData={this.loadMoreContactData} allContactsData={allContactsData} showProfileDetailPoppup={showProfileDetailPoppup} selectedContactProfileData={this.selectedContactProfileData} />
                                <TouchableOpacity style={styles.topScrollButtonView} onPress={() => this.scrollToTop()}>
                                    <Image style={styles.topScrollImage} source={images.topArrowImage} />
                                </TouchableOpacity>
                            </>
                        )
                }
                <ContactProfileModal checkNightModeActive={checkNightModeActive} showProfileDetailPoppup={showProfileDetailPoppup} selectedContactProfileData={this.selectedContactProfileData} selectedContactDetails={selectedContactDetails} girlImage={images.girlImage} emailImage={images.emailImage} phoneImage={images.phoneImage} addressImage={images.addressImage} />
            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
        selectedContactDetails: state.contactProfileData.selectedContactDetails,
        checkNightModeActive: state.contactProfileData.isNightModeActive,
    }
}
const mapDispatchToProps = dispatch => bindActionCreators({
    profileDetailModal: profileDetailModal,
    isNightModeActive: isNightModeActive,
}, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(ContactLists);
