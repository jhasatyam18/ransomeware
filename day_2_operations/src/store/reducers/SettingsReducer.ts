import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_STATE } from '../../constants/initState';

const supportBundleSlice = createSlice({
    name: 'supportBundle',
    initialState: INITIAL_STATE.settings,
    reducers: {
        supportBundleFetched: (state, action: PayloadAction<any[]>) => {
            state.bundles = action.payload;
        },
    },
});

export const { supportBundleFetched } = supportBundleSlice.actions;
export default supportBundleSlice.reducer;
