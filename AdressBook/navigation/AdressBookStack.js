import { createStackNavigator } from 'react-navigation-stack';
import ContactLists from '../../AdressBook/screens/ContactLists';

const AdressBookStack = createStackNavigator({
    ContactLists: { screen: ContactLists },

});

export default AdressBookStack; 