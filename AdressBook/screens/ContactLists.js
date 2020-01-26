import React, { PureComponent } from 'react'
import { Text, View, FlatList, TouchableOpacity, TouchableWithoutFeedback, TextInput, I18nManager, Image, Animated, StyleSheet, ActivityIndicator, Easing } from 'react-native';
import { UIConstants } from '../../AdressBook/screens/staticFile';
import * as RNLocalize from "react-native-localize";
import LinearGradient from 'react-native-linear-gradient';
import Modal from "react-native-modal";
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
            changeLanguage: RNLocalize.addEventListener,
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
    changeLanguage = (language) => {
        this.setState({ changeLanguage: language });
    }
    render() {
        console.log("check redux stord data which pass through by reducers and taken by action = ", this.props.selectedContactDetails, "Night Mode = ", this.props.checkNightModeActive);
        const { allContactsData } = this.state;
        const { searchContactName } = this.state;
        const { showProfileDetailPoppup } = this.state;
        const { scrollY } = this.state;
        const { selectedContactDetails } = this.props;
        const { isLoading } = this.state;
        const { checkNightModeActive } = this.props;
        //const { isNightModeActive } = this.state;
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
                            placeholder={'Search Contact'}
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

const ContactFlatlist = React.forwardRef(({ checkNightModeActive, scrollY, loadMoreContactData, allContactsData, showProfileDetailPoppup, selectedContactProfileData }, ref) => {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <FlatList
                ref={ref}
                showsVerticalScrollIndicator={true}
                initialNumToRender={50}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }]
                )}
                scrollEventThrottle={1}
                numColumns={3}
                windowSize={21}
                maxToRenderPerBatch={50}
                updateCellsBatchingPeriod={50}
                removeClippedSubviews={true}
                onEndReached={() => loadMoreContactData()}
                onEndReachedThreshold={0.8}
                data={allContactsData.sort((a, b) => a.name.first.localeCompare(b.name.first))}
                style={styles.flatliStyle}
                renderItem={({ item }) =>
                    <TouchableOpacity style={styles.contactListMainView} onPress={() => selectedContactProfileData(!showProfileDetailPoppup, item)}>
                        <View style={styles.contactListProfileImageView}>
                            <Image style={styles.contactListProfileImage} source={{ uri: `${item && item.picture && item.picture.medium || ''}` }} />
                        </View>
                        <Text numberOfLines={1} style={checkNightModeActive == 0 ? styles.contactListProfileName : styles.contactListNightModeProfileName}>{item && item.name && item.name.first || ''} {item && item.name && item.name.last || ''}</Text>
                        <Text numberOfLines={1} style={styles.contactListProfileCellNumber}>{item.cell}</Text>
                    </TouchableOpacity>
                }
                keyExtractor={item => item.login.uuid}
            />
        </View>
    );
}
);
const ContactProfileModal = ({ checkNightModeActive, showProfileDetailPoppup, selectedContactProfileData, selectedContactDetails, girlImage, emailImage, phoneImage, addressImage }) => {
    return (
        < Modal
            transparent={true}
            isVisible={showProfileDetailPoppup}
            animationOutTiming={50}
            animationInTiming={50}
            useNativeDriver={true}
            animationIn='fadeIn'
            animationOut='fadeOut'
            hideModalContentWhileAnimating={true}
            onRequestClose={() => {
                selectedContactProfileData(!showProfileDetailPoppup);
            }}
            customBackdrop={
                < TouchableWithoutFeedback onPress={() => selectedContactProfileData(!showProfileDetailPoppup)}>
                    <View style={{ flex: 1, backgroundColor: '#F48FB1', opacity: 0.9 }} />
                </TouchableWithoutFeedback >
            }
            style={styles.modal}>
            <View style={styles.modalMainView}>
                <View style={checkNightModeActive == 0 ? styles.profileDescriptionModalView : styles.profileDescriptionNightModeModalView}>
                    <View style={styles.profileNameAgeModalView}>
                        <Text style={checkNightModeActive == 0 ? styles.modalProfileName : styles.modalNightModeProfileName}>{selectedContactDetails.firstName} {selectedContactDetails.lastName}</Text>
                        <Text style={checkNightModeActive == 0 ? styles.modalProfileName : styles.modalNightModeProfileName}>, </Text>
                        <Text style={styles.modalProfileAge}>{selectedContactDetails.age}</Text>
                    </View>
                    <View style={styles.modalContactDetailMainView}>
                        <Image resizeMode="center" style={styles.modalDescriptionImages} source={phoneImage} />
                        <View style={styles.modalContactAndAdressView}>
                            <Text style={checkNightModeActive == 0 ? styles.modalProfileMainDescriptionText : styles.modalNightModeProfileMainDescriptionText}>{selectedContactDetails.cell}</Text>
                            <Text style={styles.modalLandlineAndPostCodeText}>{selectedContactDetails.landlineNumber}</Text>
                        </View>
                    </View>
                    <View style={styles.modalEmailAndPostCodeMainView}>
                        <Image style={styles.modalDescriptionImages} source={emailImage} />
                        <Text style={checkNightModeActive == 0 ? styles.modalProfileMainDescriptionText : styles.modalNightModeProfileMainDescriptionText}>{selectedContactDetails.email}</Text>
                    </View>
                    <View style={styles.modalEmailAndPostCodeMainView}>
                        <Image style={styles.modalDescriptionImages} source={addressImage} />
                        <View style={styles.modalContactAndAdressView}>
                            <Text numberOfLines={2} style={checkNightModeActive == 0 ? styles.modalAddressText : styles.modalNightModeAddressText}>{selectedContactDetails.street}, {selectedContactDetails.city}, {selectedContactDetails.state}</Text>
                            <Text style={styles.modalLandlineAndPostCodeText}>Postal Code - {selectedContactDetails.postalCode}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.modalProfileImageView}>
                    <Image style={styles.modalProfileImage} source={{ uri: `${selectedContactDetails.profileImage}` }} />
                </View>
            </View>
        </Modal >
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, backgroundColor: '#fff'
    },
    mainNightModeContainer: {
        flex: 1, backgroundColor: '#000'
    },
    mainHeader: {
        width: '100%',
        height: UIConstants.vw * 110,
        backgroundColor: '#00695C',
        borderBottomLeftRadius: UIConstants.vw * 80,
        borderBottomRightRadius: UIConstants.vw * 80,
        elevation: UIConstants.vw * 4,
        borderLeftWidth: UIConstants.vw * 2,
        borderRightWidth: UIConstants.vw * 2,
        borderBottomWidth: UIConstants.vw * 2,
        borderColor: '#fff',
        alignItems: 'center',
        overflow: 'hidden',
    },
    searchBar: {
        marginTop: UIConstants.vw * 16,
        backgroundColor: '#fff',
        alignSelf: 'stretch',
        marginLeft: UIConstants.vw * 40,
        marginRight: UIConstants.vw * 40,
        borderRadius: UIConstants.vw * 48 / 2,
        flexDirection: 'row',
        alignItems: 'center',
        height: UIConstants.vw * 48
    },
    subHeader: {
        backgroundColor: '#00695C',
        width: '100%',
        height: UIConstants.vw * 50,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: UIConstants.vw * 2,
        flexDirection: 'row'
    },
    profileImageView: {
        marginLeft: UIConstants.vw * 16,
        position: 'absolute', left: 0
    },
    headerImages: {
        width: UIConstants.vw * 30,  // Profile and Night || Sun images
        height: UIConstants.vw * 30
    },
    headerTitle: {
        fontSize: UIConstants.vw * 20,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'CircularStd-Book',
    },
    nightDayImageView: {
        marginRight: UIConstants.vw * 16,
        position: 'absolute', right: 0
    },
    searchImageView: {
        width: UIConstants.vw * 34,
        height: UIConstants.vw * 34,
        borderRadius: UIConstants.vw * 17,
        marginLeft: UIConstants.vw * 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchImage: {
        width: UIConstants.vw * 12,
        height: UIConstants.vw * 12
    },
    searchTextInput: {
        height: UIConstants.vw * 45,
        marginLeft: UIConstants.vw * 12,
        fontFamily: 'CircularStd-Book',
        width: '80%'
    },
    loaderMainView: {
        justifyContent: 'center',
        alignItems: 'center', flex: 1
    },
    loaderChildView: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    phoneImageLoaderView: {
        backgroundColor: '#009688',
        borderRadius: UIConstants.vw * 30 / 2,
        width: UIConstants.vw * 30,
        height: UIConstants.vw * 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    phoneImageLoader: {
        width: UIConstants.vw * 15,
        height: UIConstants.vw * 15
    },
    loader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    topScrollButtonView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: UIConstants.vw * 18,
        marginLeft: UIConstants.vw * 160,
        marginRight: UIConstants.vw * 160
    },
    topScrollImage: {
        width: UIConstants.vw * 35,
        height: UIConstants.vw * 35,
        elevation: UIConstants.vw * 4
    },

    // ContactFlatlist ---->
    flatliStyle: {
        marginLeft: UIConstants.vw * 8,
        marginRight: UIConstants.vw * 8
    },
    contactListMainView: {
        marginLeft: UIConstants.vw * 16,
        marginRight: UIConstants.vw * 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contactListProfileImageView: {
        marginTop: UIConstants.vw * 16,
        backgroundColor: '#fff',
        elevation: 2,
        borderRadius: UIConstants.vw * 30
    },
    contactListProfileImage: {
        width: UIConstants.vw * 58,
        height: UIConstants.vw * 58,
        borderRadius: UIConstants.vw * 58 / 2
    },
    contactListProfileName: {
        fontSize: UIConstants.vw * 16,
        fontWeight: 'bold',
        color: '#000',
        marginTop: UIConstants.vw * 8,
        width: UIConstants.vw * 95
    },
    contactListNightModeProfileName: {
        fontSize: UIConstants.vw * 16,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: UIConstants.vw * 8,
        width: UIConstants.vw * 95
    },
    contactListProfileCellNumber: {
        fontSize: UIConstants.vw * 12,
        fontWeight: 'bold',
        color: '#9E9E9E',
        marginTop: UIConstants.vw * 2
    },

    // ContactProfileModal ---->
    modal: {
        backgroundColor: 'transparent',
        marginTop: UIConstants.vw * 0,
        marginLeft: UIConstants.vw * 0,
        marginRight: UIConstants.vw * 0,
        marginBottom: UIConstants.vw * 0,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    modalMainView: {
        height: UIConstants.vw * 430,
        backgroundColor: 'transparent',
        alignItems: 'center'
    },
    profileDescriptionModalView: {
        height: UIConstants.vw * 350,
        borderTopRightRadius: UIConstants.vw * 160,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center'
    },
    profileDescriptionNightModeModalView: {
        height: UIConstants.vw * 350,
        borderTopRightRadius: UIConstants.vw * 160,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        backgroundColor: '#000',
        justifyContent: 'center'
    },
    profileNameAgeModalView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: UIConstants.vw * 28
    },
    modalProfileName: {
        fontSize: UIConstants.vw * 26,
        color: '#616161',
        fontFamily: 'CircularStd-Book'
    },
    modalNightModeProfileName: {
        fontSize: UIConstants.vw * 26,
        color: '#fff',
        fontFamily: 'CircularStd-Book'
    },
    modalProfileAge: {
        fontSize: UIConstants.vw * 26,
        color: '#F48FB1',
        fontFamily: 'CircularStd-Book'
    },
    modalContactDetailMainView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: UIConstants.vw * 24,
        marginTop: UIConstants.vw * 32,
        alignSelf: 'flex-start'
    },
    modalDescriptionImages: {
        width: UIConstants.vw * 28,
        height: UIConstants.vw * 25,  // phone, mail and address images
        marginRight: UIConstants.vw * 24
    },
    modalContactAndAdressView: {
        alignItems: 'center' /// contact landline and address views
    },
    modalProfileMainDescriptionText: {
        fontSize: UIConstants.vw * 18,
        color: '#000',  // for cell text and email text
        fontFamily: 'CircularStd-Book'
    },
    modalNightModeProfileMainDescriptionText: {
        fontSize: UIConstants.vw * 18,
        color: '#fff',  // for cell text and email text
        fontFamily: 'CircularStd-Book'
    },
    modalLandlineAndPostCodeText: {
        fontSize: UIConstants.vw * 16,
        color: '#bdbdbd',
        fontFamily: 'CircularStd-Book',
        alignSelf: 'flex-start',
        marginTop: UIConstants.vw * 2
    },
    modalEmailAndPostCodeMainView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: UIConstants.vw * 24,
        marginTop: UIConstants.vw * 24,
        alignSelf: 'flex-start'
    },
    modalAddressText: {
        fontSize: UIConstants.vw * 18,
        color: '#000',
        fontFamily: 'CircularStd-Book',
        width: UIConstants.vw * 310
    },
    modalNightModeAddressText: {
        fontSize: UIConstants.vw * 18,
        color: '#fff',
        fontFamily: 'CircularStd-Book',
        width: UIConstants.vw * 310
    },
    modalProfileImageView: {
        height: UIConstants.vw * 145,
        width: UIConstants.vw * 145,
        backgroundColor: '#fff',
        borderRadius: UIConstants.vw * 145 / 2,
        position: 'absolute',
        top: 0,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: UIConstants.vw * 8,
        borderColor: '#fff',
        elevation: 2
    },
    modalProfileImage: {
        width: UIConstants.vw * 134,
        height: UIConstants.vw * 134,
        borderRadius: UIConstants.vw * 134 / 2
    },

});
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
