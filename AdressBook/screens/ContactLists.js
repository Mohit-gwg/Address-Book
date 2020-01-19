import React, { PureComponent } from 'react'
import { Text, View, FlatList, TouchableOpacity, SectionList, TextInput, I18nManager, Image } from 'react-native';
import { UIConstants } from '../../AdressBook/screens/staticFile';
import * as RNLocalize from "react-native-localize";
import LinearGradient from 'react-native-linear-gradient';
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

class ContactLists extends PureComponent {

    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        setI18nConfig();
        this.state = {
            enteredText: '',
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
    handleLocalizationChange = () => {
        setI18nConfig();
        this.forceUpdate();
    };
    fetchContactData = () => {
        fetch(`https://randomuser.me/api/?results=1000&page=${this.state.page}`).then((response) =>
            response.json()).then((responseData) => {
                console.log(responseData.results[0]);
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
    render() {
        const { allContactsData } = this.state;
        const { searchContactName } = this.state;
        const { isSearchedData } = this.state;
        const images = {
            profileImage: require('../../AdressBook/images/user.png'),
            searchImage: require('../../AdressBook/images/search.png'),
        }
        return (
            <View style={{ flex: 1, backgroundColor: '#B3E5FC' }}>
                <View style={{ width: '100%', height: UIConstants.vw * 140, backgroundColor: '#0288D1', borderBottomLeftRadius: UIConstants.vw * 80, borderBottomRightRadius: UIConstants.vw * 80, elevation: UIConstants.vw * 4, borderLeftWidth: UIConstants.vw * 2, borderRightWidth: UIConstants.vw * 2, borderBottomWidth: UIConstants.vw * 2, borderColor: '#fff', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#01579B', width: '100%', height: UIConstants.vw * 50, alignItems: 'center', justifyContent: 'center', elevation: UIConstants.vw * 2, flexDirection: 'row' }}>
                        <TouchableOpacity style={{ marginLeft: UIConstants.vw * 8, position: 'absolute', left: 0 }}>
                            <Image style={{ width: 30, height: 30, borderWidth: UIConstants.vw * 1, borderColor: '#fff', borderRadius: UIConstants.vw * 15 }} source={images.profileImage} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: UIConstants.vw * 20, fontWeight: 'bold', color: '#fff', fontFamily: 'CircularStd-Book' }}>{translate("contactLists")}</Text>
                    </View>
                    <View style={{ marginTop: UIConstants.vw * 20, backgroundColor: '#fff', alignSelf: 'stretch', marginLeft: UIConstants.vw * 45, marginRight: UIConstants.vw * 45, borderBottomLeftRadius: UIConstants.vw * 22, borderTopRightRadius: UIConstants.vw * 22, flexDirection: 'row', alignItems: 'center', height: UIConstants.vw * 50 }}>
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
                    </View>
                </View>
                <ContactFlatlist loadMoreContactData={this.loadMoreContactData} allContactsData={allContactsData} isSearchedData={isSearchedData} />
            </View>
        );
    }
}
const ContactFlatlist = ({ loadMoreContactData, allContactsData }) => {
    return (
        <>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: UIConstants.vw * 8 }}>
                <FlatList
                    showsVerticalScrollIndicator={true}
                    initialNumToRender={50}
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

export default ContactLists;
