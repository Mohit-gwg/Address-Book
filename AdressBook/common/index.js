import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AdressBookSplashScreen from '../../AdressBook/screens/AdressBookSplashScreen';
import ContactLists from '../../AdressBook/screens/ContactLists';
//import AdressBookStack from '../../AdressBook/navigation/AdressBookStack';

const Root = createSwitchNavigator(
    {
        AdressBookSplashScreen: AdressBookSplashScreen,
        ContactLists: ContactLists,
        //AdressBookStack: AdressBookStack,
    },
    {
        initialRouteName: 'AdressBookSplashScreen',
    }
);

export const Main = createAppContainer(Root);