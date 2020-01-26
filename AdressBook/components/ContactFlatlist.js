import React from 'react'
import { Text, View, FlatList, TouchableOpacity, TouchableWithoutFeedback, TextInput, I18nManager, Image, Animated, StyleSheet, ActivityIndicator, Easing } from 'react-native';
import styles from '../../AdressBook/styles/ContactLists';

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

export default ContactFlatlist;