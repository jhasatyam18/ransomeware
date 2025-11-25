import { STATIC_KEYS } from '../constants/StoreKey';
import { MODAL_SUMMARY } from '../constants/userConstant';
import { RecoveryData, UserInterface } from '../interfaces/interface';
import { AppDispatch } from '../store';
import { getPlatformType } from '../store/actions/siteAction';
import { openModal } from '../store/reducers/ModalReducer';
import { getValue } from './apiUtils';
import { getCleanupInfoForVM, getRecoveryInfoForVM } from './RecoveryUtils';

export const onRecoveRecoveryIconClick = (data: RecoveryData, user: UserInterface) => {
    return (dispatch: AppDispatch) => {
        const { values } = user;
        const parsedConfiguration = data.config !== '' && typeof data.config !== 'undefined' ? JSON.parse(data.config) : undefined;
        const COPY_CONFIG = [
            { value: 'copy_gen_config', label: 'General' },
            { value: 'copy_net_config', label: 'Network' },
            { value: 'copy_rep_script_config', label: 'Replication Scripts' },
            { value: 'copy_rec_script_config', label: 'Recovery Scripts' },
        ];
        const siteOptions = getValue({ key: STATIC_KEYS.GLOBAL_OPT_SITE_DATA, values });
        const selectedSiteId = getValue({ key: STATIC_KEYS.GLOBAL_SITE_KEY, values });
        const platformType = getPlatformType(selectedSiteId, siteOptions) || '';
        let options = {};
        if (data.recoveryType.indexOf('cleanup') !== -1) {
            const configData = getCleanupInfoForVM(data);
            options = { title: 'Cleanup Configuration', data: configData, css: 'modal-lg', showSummary: true };
        } else {
            const configData = getRecoveryInfoForVM({ user, configToCopy: COPY_CONFIG, recoveryConfig: parsedConfiguration, platformType });
            options = { title: 'Recovery Configuration', data: configData, css: 'modal-lg', showSummary: true };
        }
        dispatch(openModal({ content: MODAL_SUMMARY, options }));
    };
};
