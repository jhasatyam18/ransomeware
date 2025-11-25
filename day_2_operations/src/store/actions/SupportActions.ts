import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { API_DELETE_SUPPORT_BUNDLE, API_SUPPORT_BUNDLE } from '../../constants/ApiUrlConstant';
import { MESSAGE_TYPES } from '../../constants/userConstant';
import { API_TYPES, callAPI, createPayload } from '../../utils/apiUtils';
import { refresh } from '../../utils/appUtils';
import { hideApplicationLoader, showApplicationLoader } from '../reducers/globalReducer';
import { addMessage } from '../reducers/messageReducer';
import { closeModal } from '../reducers/ModalReducer';
import { supportBundleFetched } from '../reducers/SettingsReducer';
import { SupportBundlePayload } from '../../interfaces/interface';

export function generateSupportBundle(bundle: SupportBundlePayload) {
    return (dispatch: ThunkDispatch<RootState, undefined, UnknownAction>) => {
        dispatch(showApplicationLoader({ key: API_SUPPORT_BUNDLE, value: 'Generate support bundle.' }));
        const obj = createPayload(API_TYPES.POST, bundle);
        return callAPI(API_SUPPORT_BUNDLE, obj).then(
            (json) => {
                dispatch(hideApplicationLoader(API_SUPPORT_BUNDLE));
                if (json.hasError) {
                    dispatch(addMessage({ message: json.message, messageType: MESSAGE_TYPES.ERROR }));
                } else {
                    dispatch(addMessage({ message: 'Generate new support bundle started. Use support bundle list for more details.', messageType: MESSAGE_TYPES.INFO }));
                    dispatch(refresh());
                }
            },
            (err) => {
                dispatch(hideApplicationLoader(API_SUPPORT_BUNDLE));
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
            },
        );
    };
}

export function fetchSupportBundles() {
    return (dispatch: ThunkDispatch<RootState, undefined, UnknownAction>) => {
        dispatch(showApplicationLoader({ key: API_SUPPORT_BUNDLE, value: 'Loading support bundles...' }));
        return callAPI(API_SUPPORT_BUNDLE).then(
            (json) => {
                dispatch(hideApplicationLoader(API_SUPPORT_BUNDLE));
                if (json.hasError) {
                    dispatch(addMessage({ message: json.message, messageType: MESSAGE_TYPES.ERROR }));
                } else {
                    dispatch(supportBundleFetched(json));
                }
            },
            (err) => {
                dispatch(hideApplicationLoader(API_SUPPORT_BUNDLE));
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
            },
        );
    };
}

export function deleteSupportBundle(id: number) {
    return (dispatch: ThunkDispatch<RootState, undefined, UnknownAction>) => {
        dispatch(showApplicationLoader({ key: API_DELETE_SUPPORT_BUNDLE, value: 'Removing support bundle...' }));
        const obj = createPayload(API_TYPES.DELETE, {});
        return callAPI(API_DELETE_SUPPORT_BUNDLE.replace('<id>', id.toString()), obj).then(
            (json) => {
                dispatch(hideApplicationLoader(API_DELETE_SUPPORT_BUNDLE));
                if (json.hasError) {
                    dispatch(addMessage({ message: json.message, messageType: MESSAGE_TYPES.ERROR }));
                } else {
                    dispatch(addMessage({ message: 'Support bundle deleted successfully', messageType: MESSAGE_TYPES.INFO }));
                    dispatch(refresh());
                    dispatch(closeModal());
                }
            },
            (err) => {
                dispatch(hideApplicationLoader(API_DELETE_SUPPORT_BUNDLE));
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
            },
        );
    };
}
