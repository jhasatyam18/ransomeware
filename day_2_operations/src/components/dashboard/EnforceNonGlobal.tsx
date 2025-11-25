import { useEffect } from 'react';
import { STATIC_KEYS } from '../../constants/StoreKey';
import { valueChange } from '../../store/reducers/userReducer';

export default function useEnforceNonGlobal(siteId: string, options: any[], dispatch: any, condition: boolean = true) {
    useEffect(() => {
        if (!condition) return;
        if (siteId === '1' && options.length > 1) {
            const firstNonGlobal = options.find((o: any) => o.label !== 'Global')?.value;
            if (firstNonGlobal) {
                dispatch(valueChange([STATIC_KEYS.GLOBAL_SITE_KEY, firstNonGlobal]));
            }
        }
    }, [siteId, options, dispatch, condition]);
}
