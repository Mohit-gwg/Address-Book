import { ADD_SELECTED_CONTACT_DATA } from '../../../AdressBook/common/Actions/ActionTypes';
import { IS_NIGHT_MODE_ACTIVE } from '../../../AdressBook/common/Actions/ActionTypes';

const initialState = {
    selectedContactDetails: {
        profileImage: '',
        firstName: '',
        lastName: '',
        age: 0,
        cell: 0,
        landlineNumber: 0,
        email: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
    },
    isNightModeActive: 0,
}

const ContactProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_SELECTED_CONTACT_DATA:
            return {
                ...state,
                selectedContactDetails: {
                    profileImage: action.selectedContactDetails.profileImage,
                    firstName: action.selectedContactDetails.firstName,
                    lastName: action.selectedContactDetails.firstName,
                    age: action.selectedContactDetails.age,
                    cell: action.selectedContactDetails.cell,
                    landlineNumber: action.selectedContactDetails.landlineNumber,
                    email: action.selectedContactDetails.email,
                    street: action.selectedContactDetails.street,
                    city: action.selectedContactDetails.city,
                    state: action.selectedContactDetails.state,
                    postalCode: action.selectedContactDetails.postalCode,
                }
            }
        case IS_NIGHT_MODE_ACTIVE:
            return {
                ...state,
                isNightModeActive: action.isNightModeActive,
            }
        default:
            return state;
    }
}
export default ContactProfileReducer;