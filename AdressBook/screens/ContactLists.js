import React, { PureComponent } from 'react'
import { Text, View, FlatList, TouchableOpacity, TouchableWithoutFeedback, TextInput, I18nManager, Image, Animated, StyleSheet } from 'react-native';
import { UIConstants } from '../../AdressBook/screens/staticFile';
import * as RNLocalize from "react-native-localize";
import LinearGradient from 'react-native-linear-gradient';
import Modal from "react-native-modal";
import i18n from "i18n-js";
import memoize from "lodash.memoize";

let levelScrollView = null;
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
            isSearchedData: true,
        }
    }
    componentDidMount() {
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
        this.fetchContactData();
    }
    componentWillUnmount() {
        RNLocalize.removeEventListener("change", this.handleLocalizationChange);
    }
    showProfileDetailPoppup_Modal = (visible) => {
        if (visible == true) {
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
        else if (!Array.isArray(filteredName) && !filteredName.length) {
            this.setState({
                isSearchedData: false
            })
        }
        else if (Array.isArray(filteredName)) {
            this.setState({
                isSearchedData: true,
                allContactsData: filteredName
            })
        }
    }
    scrollToTop = () => {
        this._flatlist.scrollTo({ x: 845, y: 845, animated: true });
    }
    render() {
        const { allContactsData } = this.state;
        const { searchContactName } = this.state;
        const { isSearchedData } = this.state;
        const { showProfileDetailPoppup } = this.state;
        const { scrollY } = this.state;
        const images = {
            profileImage: require('../../AdressBook/images/user.png'),
            searchImage: require('../../AdressBook/images/search.png'),
        }
        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp',
        });
        const imageOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp',
        });
        const imageTranslate = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -50],
            extrapolate: 'clamp',
        });
        return (
            <View style={{ flex: 1, backgroundColor: '#B3E5FC' }}>
                <Animated.View style={[styles.mainHeader, { height: headerHeight }]}>
                    <View style={{ backgroundColor: '#01579B', width: '100%', height: UIConstants.vw * 50, alignItems: 'center', justifyContent: 'center', elevation: UIConstants.vw * 2, flexDirection: 'row' }}>
                        <TouchableOpacity style={{ marginLeft: UIConstants.vw * 16, position: 'absolute', left: 0 }} onPress={() => this.showProfileDetailPoppup_Modal(!showProfileDetailPoppup)}>
                            <Image style={{ width: 30, height: 30, borderWidth: UIConstants.vw * 1, borderColor: '#fff', borderRadius: UIConstants.vw * 15 }} source={images.profileImage} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: UIConstants.vw * 20, fontWeight: 'bold', color: '#fff', fontFamily: 'CircularStd-Book' }}>{translate("contactLists")}</Text>
                    </View>
                    <Animated.View style={[styles.subHeader, { opacity: imageOpacity, transform: [{ translateY: imageTranslate }] }]}>
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
                <ContactFlatlist scrollY={scrollY} loadMoreContactData={this.loadMoreContactData} allContactsData={allContactsData} isSearchedData={isSearchedData} />
                <TouchableOpacity style={{ position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: UIConstants.vw * 12, marginBottom: UIConstants.vw * 18, marginLeft: UIConstants.vw * 160, marginRight: UIConstants.vw * 160, elevation: UIConstants.vw * 2 }} onPress={() => this.scrollToTop()}>
                    <Text style={{ fontSize: UIConstants.vw * 18, fontWeight: 'bold', color: '#F8BBD0', paddingTop: UIConstants.vw * 4, paddingBottom: UIConstants.vw * 4 }}>Button</Text>
                </TouchableOpacity>
                <Modal
                    transparent={true}
                    isVisible={showProfileDetailPoppup}
                    useNativeDriver={true}
                    animationOutTiming={50}
                    animationInTiming={50}
                    animationIn='fadeIn'
                    animationOut='fadeOut'
                    useNativeDriver={true}
                    hideModalContentWhileAnimating={true}
                    onRequestClose={() => {
                        this.showProfileDetailPoppup_Modal(!showProfileDetailPoppup);
                    }}
                    customBackdrop={
                        <TouchableWithoutFeedback onPress={() => this.showProfileDetailPoppup_Modal(!showProfileDetailPoppup)}>
                            <View style={{ flex: 1, backgroundColor: '#000' }} />
                        </TouchableWithoutFeedback>
                    }
                    style={{
                        backgroundColor: 'transparent',
                        marginTop: UIConstants.vw * 0,
                        marginLeft: UIConstants.vw * 0,
                        marginRight: UIConstants.vw * 0,
                        marginBottom: UIConstants.vw * 0,
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}>
                    <View style={{
                        padding: UIConstants.vw * 60,
                        backgroundColor: '#fff',
                        elevation: UIConstants.vw * 2,
                        borderColor: '#9E9E9E',
                        borderRadius: UIConstants.vw * 16
                    }} >
                        <Text style={{}}>Merci, votre présence{'\n'}est enregistree!</Text>
                    </View>
                </Modal>
            </View>
        );
    }
}
const ContactFlatlist = ({ scrollY, loadMoreContactData, allContactsData }) => {
    return (
        <>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: UIConstants.vw * 8 }}>
                <FlatList
                    ref={(ref) => { this._flatlist = ref; }}
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
                        <TouchableOpacity style={{ marginLeft: UIConstants.vw * 16, marginRight: UIConstants.vw * 16, alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ width: UIConstants.vw * 60, height: UIConstants.vw * 60, borderRadius: UIConstants.vw * 30, backgroundColor: '#eee', marginTop: UIConstants.vw * 16, borderWidth: 2, borderColor: "#F48FB1" }} source={{ uri: `${item && item.picture && item.picture.medium || ''}` }} />
                            <Text numberOfLines={1} style={{ fontSize: UIConstants.vw * 16, fontWeight: 'bold', color: '#F48FB1', marginTop: UIConstants.vw * 8, width: UIConstants.vw * 95 }}>{item && item.name && item.name.first || ''} {item && item.name && item.name.last || ''}</Text>
                            <Text numberOfLines={1} style={{ fontSize: UIConstants.vw * 12, fontWeight: 'bold', color: '#9E9E9E', marginTop: UIConstants.vw * 2 }}>{item.cell}</Text>
                        </TouchableOpacity>
                    }
                    keyExtractor={item => item.login.uuid}
                />
            </View>
        </>

    );
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
        marginTop: UIConstants.vw * 20,
        backgroundColor: '#fff',
        alignSelf: 'stretch',
        marginLeft: UIConstants.vw * 45,
        marginRight: UIConstants.vw * 45,
        borderBottomLeftRadius: UIConstants.vw * 22,
        borderTopRightRadius: UIConstants.vw * 22,
        flexDirection: 'row',
        alignItems: 'center',
        height: UIConstants.vw * 50
    },
});

export default ContactLists;
