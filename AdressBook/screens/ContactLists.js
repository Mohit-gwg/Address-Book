import React, { PureComponent } from 'react'
import { Text, View, FlatList, TouchableOpacity, TouchableWithoutFeedback, TextInput, I18nManager, Image, Animated, StyleSheet } from 'react-native';
import { UIConstants } from '../../AdressBook/screens/staticFile';
import * as RNLocalize from "react-native-localize";
import LinearGradient from 'react-native-linear-gradient';
import Modal from "react-native-modal";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { profileDetailModal } from '../../AdressBook/common/Actions/ContactProfileActions';
import i18n from "i18n-js";
import memoize from "lodash.memoize";

const HEADER_MAX_HEIGHT = UIConstants.vw * 150;
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
        fetch(`https://randomuser.me/api/?results=1000&page=${this.state.page}`).then((response) =>
            response.json()).then((responseData) => {
                this.setState({ allContactsData: [...this.state.allContactsData, ...responseData.results] });
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
        //console.log("check redux stord data which pass through by reducers and taken by action = ", this.props.selectedContactDetails);
        const { allContactsData } = this.state;
        const { searchContactName } = this.state;
        const { showProfileDetailPoppup } = this.state;
        const { scrollY } = this.state;
        const { selectedContactDetails } = this.props;
        const images = {
            profileImage: require('../../AdressBook/images/user.png'),
            searchImage: require('../../AdressBook/images/search.png'),
            topArrowImage: require('../../AdressBook/images/upArrowNew.png'),
            girlImage: require('../../AdressBook/images/girl.png'),
            emailImage: require('../../AdressBook/images/mail.png'),
            phoneImage: require('../../AdressBook/images/phone.png'),
            addressImage: require('../../AdressBook/images/address.png'),
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
            <View style={{ flex: 1 }}>
                <Animated.View style={[styles.mainHeader, { height: headerHeight }]}>
                    <View style={{ backgroundColor: '#01579B', width: '100%', height: UIConstants.vw * 50, alignItems: 'center', justifyContent: 'center', elevation: UIConstants.vw * 2, flexDirection: 'row' }}>
                        <TouchableOpacity style={{ marginLeft: UIConstants.vw * 16, position: 'absolute', left: 0 }}>
                            <Image style={{ width: 30, height: 30, borderWidth: UIConstants.vw * 1, borderColor: '#fff', borderRadius: UIConstants.vw * 15 }} source={images.profileImage} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: UIConstants.vw * 20, fontWeight: 'bold', color: '#fff', fontFamily: 'CircularStd-Book', }}>{translate("contactLists")}</Text>
                    </View>
                    <Animated.View style={[styles.subHeader, { opacity: subViewOpacity, transform: [{ translateY: subViewTranslate }] }]}>
                        <LinearGradient
                            colors={['#F8BBD0', '#F48FB1']}
                            start={{ x: 0.0, y: 0.6 }} end={{ x: 0.2, y: 0.80 }}
                            style={{ width: UIConstants.vw * 34, height: UIConstants.vw * 34, borderRadius: UIConstants.vw * 17, marginLeft: UIConstants.vw * 8, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Image style={{ width: UIConstants.vw * 12, height: UIConstants.vw * 12 }} source={images.searchImage} />
                        </LinearGradient>
                        <TextInput
                            style={{ height: UIConstants.vw * 45, marginLeft: UIConstants.vw * 12, fontFamily: 'CircularStd-Book', width: '80%' }}
                            underlineColorAndroid='transparent'
                            placeholderTextColor={'#D6D4DC'}
                            maxHeight={40}
                            placeholder={'Search Contact'}
                            onChangeText={text => this.searchText(text)}
                            value={searchContactName}
                        />
                    </Animated.View>
                </Animated.View>
                <ContactFlatlist ref={r => this._flatlist = r} scrollY={scrollY} loadMoreContactData={this.loadMoreContactData} allContactsData={allContactsData} showProfileDetailPoppup={showProfileDetailPoppup} selectedContactProfileData={this.selectedContactProfileData} />
                <TouchableOpacity style={{ position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center', marginBottom: UIConstants.vw * 18, marginLeft: UIConstants.vw * 160, marginRight: UIConstants.vw * 160 }} onPress={() => this.scrollToTop()}>
                    <Image style={{ width: UIConstants.vw * 35, height: UIConstants.vw * 35, elevation: UIConstants.vw * 4 }} source={images.topArrowImage} />
                </TouchableOpacity>
                <ContactProfileModal showProfileDetailPoppup={showProfileDetailPoppup} selectedContactProfileData={this.selectedContactProfileData} selectedContactDetails={selectedContactDetails} girlImage={images.girlImage} emailImage={images.emailImage} phoneImage={images.phoneImage} addressImage={images.addressImage} />
            </View>
        );
    }
}

const ContactFlatlist = React.forwardRef(({ scrollY, loadMoreContactData, allContactsData, showProfileDetailPoppup, selectedContactProfileData }, ref) => {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: UIConstants.vw * 8 }}>
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
                style={{ marginLeft: UIConstants.vw * 8, marginRight: UIConstants.vw * 8 }}
                renderItem={({ item }) =>
                    <TouchableOpacity style={{ marginLeft: UIConstants.vw * 16, marginRight: UIConstants.vw * 16, alignItems: 'center', justifyContent: 'center' }} onPress={() => selectedContactProfileData(!showProfileDetailPoppup, item)}>
                        <View style={{ marginTop: UIConstants.vw * 16, backgroundColor: '#fff', elevation: 2, borderRadius: UIConstants.vw * 30 }}>
                            <Image style={{ width: UIConstants.vw * 60, height: UIConstants.vw * 60, borderRadius: UIConstants.vw * 30, borderWidth: 2, borderColor: "#F48FB1" }} source={{ uri: `${item && item.picture && item.picture.medium || ''}` }} />
                        </View>
                        <Text numberOfLines={1} style={{ fontSize: UIConstants.vw * 16, fontWeight: 'bold', color: '#F48FB1', marginTop: UIConstants.vw * 8, width: UIConstants.vw * 95 }}>{item && item.name && item.name.first || ''} {item && item.name && item.name.last || ''}</Text>
                        <Text numberOfLines={1} style={{ fontSize: UIConstants.vw * 12, fontWeight: 'bold', color: '#9E9E9E', marginTop: UIConstants.vw * 2 }}>{item.cell}</Text>
                    </TouchableOpacity>
                }
                keyExtractor={item => item.login.uuid}
            />
        </View>
    );
}
);
const ContactProfileModal = ({ showProfileDetailPoppup, selectedContactProfileData, selectedContactDetails, girlImage, emailImage, phoneImage, addressImage }) => {
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
            style={{ backgroundColor: 'transparent', marginTop: UIConstants.vw * 0, marginLeft: UIConstants.vw * 0, marginRight: UIConstants.vw * 0, marginBottom: UIConstants.vw * 0, position: 'absolute', bottom: 0, left: 0, right: 0, }}>
            <View style={{ height: UIConstants.vw * 430, backgroundColor: 'transparent', alignItems: 'center' }}>
                <View style={{ height: UIConstants.vw * 350, borderTopRightRadius: UIConstants.vw * 160, position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', backgroundColor: '#fff', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: UIConstants.vw * 28 }}>
                        <Text style={{ fontSize: UIConstants.vw * 26, color: '#616161', fontFamily: 'CircularStd-Book' }}>{selectedContactDetails.firstName} {selectedContactDetails.lastName}</Text>
                        <Text style={{ fontSize: UIConstants.vw * 26, color: '#616161', fontFamily: 'CircularStd-Book' }}>, </Text>
                        <Text style={{ fontSize: UIConstants.vw * 26, color: '#F48FB1', fontFamily: 'CircularStd-Book' }}>{selectedContactDetails.age}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: UIConstants.vw * 24, marginTop: UIConstants.vw * 32, alignSelf: 'flex-start' }}>
                        <Image style={{ width: UIConstants.vw * 25, height: UIConstants.vw * 25, marginRight: UIConstants.vw * 24 }} source={phoneImage} />
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: UIConstants.vw * 18, color: '#f8bbd0', fontFamily: 'CircularStd-Book' }}>{selectedContactDetails.cell}</Text>
                            <Text style={{ fontSize: UIConstants.vw * 16, color: '#bdbdbd', fontFamily: 'CircularStd-Book', alignSelf: 'flex-start', marginTop: UIConstants.vw * 2 }}>{selectedContactDetails.landlineNumber}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: UIConstants.vw * 24, marginTop: UIConstants.vw * 24, alignSelf: 'flex-start' }}>
                        <Image style={{ width: UIConstants.vw * 28, height: UIConstants.vw * 25, marginRight: UIConstants.vw * 24 }} source={emailImage} />
                        <Text style={{ fontSize: UIConstants.vw * 18, color: '#f8bbd0', fontFamily: 'CircularStd-Book' }}>{selectedContactDetails.email}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: UIConstants.vw * 24, marginTop: UIConstants.vw * 24, alignSelf: 'flex-start' }}>
                        <Image style={{ width: UIConstants.vw * 28, height: UIConstants.vw * 25, marginRight: UIConstants.vw * 24 }} source={addressImage} />
                        <View style={{ alignItems: 'center' }}>
                            <Text numberOfLines={2} style={{ fontSize: UIConstants.vw * 18, color: '#f8bbd0', fontFamily: 'CircularStd-Book', width: UIConstants.vw * 310 }}>{selectedContactDetails.street}, {selectedContactDetails.city}, {selectedContactDetails.state}</Text>
                            <Text style={{ fontSize: UIConstants.vw * 16, color: '#bdbdbd', fontFamily: 'CircularStd-Book', alignSelf: 'flex-start', marginTop: UIConstants.vw * 2 }}>Postal Code - {selectedContactDetails.postalCode}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ height: UIConstants.vw * 145, width: UIConstants.vw * 145, backgroundColor: '#fff', borderRadius: UIConstants.vw * 145 / 2, position: 'absolute', top: 0, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderWidth: UIConstants.vw * 8, borderColor: '#fff', elevation: 2 }}>
                    <Image style={{ width: UIConstants.vw * 134, height: UIConstants.vw * 134, borderRadius: UIConstants.vw * 134 / 2 }} source={{ uri: `${selectedContactDetails.profileImage}` }} />
                </View>
            </View>
        </Modal >
    )
}
const styles = StyleSheet.create({
    mainHeader: {
        width: '100%',
        height: UIConstants.vw * 140,
        backgroundColor: '#0288D1',
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
    subHeader: {
        marginTop: UIConstants.vw * 22,
        backgroundColor: '#fff',
        alignSelf: 'stretch',
        marginLeft: UIConstants.vw * 40,
        marginRight: UIConstants.vw * 40,
        borderBottomLeftRadius: UIConstants.vw * 22,
        borderTopRightRadius: UIConstants.vw * 22,
        flexDirection: 'row',
        alignItems: 'center',
        height: UIConstants.vw * 54
    },
});
const mapStateToProps = state => {
    return {
        selectedContactDetails: state.contactProfileData.selectedContactDetails,
    }
}
const mapDispatchToProps = dispatch => bindActionCreators({
    profileDetailModal: profileDetailModal,
}, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(ContactLists);
