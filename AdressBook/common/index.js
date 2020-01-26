import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AdressBookSplashScreen from '../../AdressBook/screens/AdressBookSplashScreen';
import AdressBookStack from '../../AdressBook/navigation/AdressBookStack';
import AddUserDetails from '../../AdressBook/screens/AddUserDetails';

const Root = createSwitchNavigator(
    {
        AdressBookSplashScreen: AdressBookSplashScreen,
        AddUserDetails: AddUserDetails,
        AdressBookStack: AdressBookStack,
    },
    {
        initialRouteName: 'AdressBookSplashScreen',
    }
);

export const Main = createAppContainer(Root);