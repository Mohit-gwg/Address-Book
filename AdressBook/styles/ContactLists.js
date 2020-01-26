import { StyleSheet } from 'react-native';
import { UIConstants } from '../../AdressBook/screens/staticFile';

export default StyleSheet.create({
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