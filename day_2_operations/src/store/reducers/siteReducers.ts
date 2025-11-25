import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SiteState {
    sites: Record<string, any>[]; // Sites as an array
    selectedSites: Record<string, any>; // Selected Sites as a key-value map
}

const INITIAL_STATE: SiteState = {
    sites: [],
    selectedSites: {},
};
interface SiteAddProps {
    data: Record<string, any>[];
}
interface SiteTableSelectionProps {
    data: Record<string, any>;
    isSelected: boolean;
    primaryKey: string;
}
const siteSlice = createSlice({
    name: 'sites',
    initialState: INITIAL_STATE,
    reducers: {
        addSiteData: (state, action: PayloadAction<SiteAddProps>) => {
            state.sites = action.payload.data;
            state.selectedSites = {};
        },
        updateselectedSites: (state, action: PayloadAction<SiteTableSelectionProps>) => {
            const { data, isSelected, primaryKey } = action.payload;
            const key = data[primaryKey];
            if (!key) return; // Ensure primaryKey exists on data
            if (isSelected) {
                state.selectedSites[key] = data;
            } else {
                delete state.selectedSites[key];
            }
        },
        resetSelectedSites: (state) => {
            state.selectedSites = {};
        },
    },
});
export const { addSiteData, updateselectedSites, resetSelectedSites } = siteSlice.actions;
export default siteSlice.reducer;
