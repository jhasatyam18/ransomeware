import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_STATE } from '../../constants/initState';
import { GlobalInterface } from '../../interfaces/interface';

type Loader = {
    key: string;
    value: string;
};

const globalSlice = createSlice({
    name: 'global',
    initialState: INITIAL_STATE.global,
    reducers: {
        showApplicationLoader: (state: GlobalInterface, action: PayloadAction<Loader>) => {
            const { key, value } = action.payload;
            state.loaderKeys[key] = value;
        },
        hideApplicationLoader: (state: GlobalInterface, action: PayloadAction<string>) => {
            delete state.loaderKeys[action.payload];
        },
        refreshApplication: (state: GlobalInterface) => {
            state.context.refresh += 1;
        },
        changeExpandedPage: (state: GlobalInterface, action: PayloadAction<string>) => {
            state.expandedPage = action.payload;
        },
        setLastSyncTime: (state: GlobalInterface, action: PayloadAction<number>) => {
            state.lastSyncTime = action.payload;
        },
    },
});
export const { showApplicationLoader, hideApplicationLoader, refreshApplication, changeExpandedPage, setLastSyncTime } = globalSlice.actions;
export default globalSlice.reducer;
