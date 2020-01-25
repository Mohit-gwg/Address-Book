import { ADD_SELECTED_CONTACT_DATA } from '../../../AdressBook/common/Actions/ActionTypes';
import { IS_NIGHT_MODE_ACTIVE } from '../../../AdressBook/common/Actions/ActionTypes';

export const profileDetailModal = (selectedContactDetails) => {
    return {
        type: ADD_SELECTED_CONTACT_DATA,
        selectedContactDetails
    }
}

export const isNightModeActive = (isNightModeActive) => {
    return {
        type: IS_NIGHT_MODE_ACTIVE,
        isNightModeActive
    }
}