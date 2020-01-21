import { SHOW_PROFILE_DETAIL_POPPUP } from '../../../AdressBook/common/Actions/ActionTypes';

export const profileDetailModal = (showProfileDetailPoppup) => {
    return {
        type: SHOW_PROFILE_DETAIL_POPPUP,
        showProfileDetailPoppup
    }
}