import { SHOW_PROFILE_DETAIL_POPPUP } from '../../../AdressBook/common/Actions/ActionTypes';

const initialState = {
    showProfileDetailPoppup: false,
}

const ContactProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_PROFILE_DETAIL_POPPUP:
            return {
                ...state,
                showProfileDetailPoppup: action.showProfileDetailPoppup,
            }
        default:
            return state;
    }
}
export default ContactProfileReducer;