import { createStore, combineReducers } from 'redux';
import ContactProfileReducer from '../../AdressBook/common/Reducers/ContactProfileReducer';

const rootReducer = combineReducers({
    contactProfileData: ContactProfileReducer
});

const configureStore = () => {
    return createStore(rootReducer);
}
export default configureStore;