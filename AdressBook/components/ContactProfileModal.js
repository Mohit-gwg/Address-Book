import React from 'react'
import { Text, View, TouchableWithoutFeedback, Image } from 'react-native';
import styles from '../../AdressBook/styles/ContactLists';
import Modal from "react-native-modal";

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
export default ContactProfileModal;