import React, { PureComponent } from 'react'
import { Text, View, FlatList, TouchableOpacity, SectionList, TextInput } from 'react-native';
import { UIConstants } from '../../AdressBook/screens/staticFile';

class ContactLists extends PureComponent {

    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
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
        this.fetchContactData(1);
    }
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
        let text = enteredText.toLowerCase()
        let allContactListsData = this.state.allContactsData
        let filteredName = allContactListsData.filter((item) => {
            return item.name.first.toLowerCase().match(text)
        })
        if (!text || text === '') {
            this.setState({
                allContactsData: this.state.allContactsData
            })
        } else if (!Array.isArray(filteredName) && !filteredName.length) {
            // set no data flag to true so as to render flatlist conditionally
            this.setState({
                isSearchedData: false
            })
        } else if (Array.isArray(filteredName)) {
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
        return (
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: UIConstants.vw * 24, fontWeight: 'bold', marginTop: UIConstants.vw * 20, alignSelf: 'center' }}>Contact Lists</Text>
                <View style={{ flexDirection: 'row', width: UIConstants.vw * 200, alignItems: 'center' }}>
                    <TextInput
                        style={{ height: UIConstants.vw * 50 }}
                        underlineColorAndroid='transparent'
                        placeholderTextColor={'#000'}
                        placeholder={'Search Contact'}
                        onChangeText={text => this.searchText(text)}
                        value={searchContactName}
                    />
                </View>

                <ContactFlatlist loadMoreContactData={this.loadMoreContactData} allContactsData={allContactsData} isSearchedData={isSearchedData} />

            </View>
        );
    }
}
const ContactFlatlist = ({ loadMoreContactData, allContactsData, isSearchedData }) => {
    return (
        <>
            {
                (isSearchedData === true)
                    ?
                    (
                        <FlatList
                            showsVerticalScrollIndicator={true}
                            initialNumToRender={50}
                            windowSize={21}
                            maxToRenderPerBatch={50}
                            updateCellsBatchingPeriod={50}
                            removeClippedSubviews={true}
                            onEndReached={() => loadMoreContactData()}
                            onEndReachedThreshold={0.8}
                            data={allContactsData.sort((a, b) => a.name.first.localeCompare(b.name.first))}
                            style={{ marginLeft: UIConstants.vw * 8, marginRight: UIConstants.vw * 8, }}
                            renderItem={({ item }) =>
                                <TouchableOpacity style={{ backgroundColor: '#fff', elevation: UIConstants.vw * 2, borderRadius: UIConstants.vw * 12, margin: UIConstants.vw * 8, }}>
                                    <Text style={{ fontSize: UIConstants.vw * 16, fontWeight: 'bold', padding: UIConstants.vw * 12, color: '#000' }}>{item && item.name && item.name.first || ''} {item && item.name && item.name.last || ''}</Text>
                                </TouchableOpacity>
                            }
                            keyExtractor={item => item.login.uuid}
                        />
                    )
                    :
                    (
                        <></>
                    )
            }

        </>
    );
}

export default ContactLists;
