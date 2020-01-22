import { ADD_SELECTED_CONTACT_DATA } from '../../../AdressBook/common/Actions/ActionTypes';

export const profileDetailModal = (selectedContactDetails) => {
    return {
        type: ADD_SELECTED_CONTACT_DATA,
        selectedContactDetails
    }
}