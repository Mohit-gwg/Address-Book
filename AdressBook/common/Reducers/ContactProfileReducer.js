import { ADD_SELECTED_CONTACT_DATA } from '../../../AdressBook/common/Actions/ActionTypes';

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
    }
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
        default:
            return state;
    }
}
export default ContactProfileReducer;