import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_STATE } from '../../constants/initState';
import { DashboardTitles } from '../../interfaces/interface';

interface SiteHealth {
    siteHealth: { name: string; rpoStatus: string; lastTestDrillTime: string; drReady: boolean }[];
}
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: INITIAL_STATE.dashboard,
    reducers: {
        setTitles: (state, action: PayloadAction<DashboardTitles>) => {
            state.titles = {
                ...state.titles,
                ...action.payload,
            };
        },
        setSiteHealth: (state, action: PayloadAction<SiteHealth>) => {
            state.titles = {
                ...state.titles,
                ...action.payload,
            };
        },
        resetDashboardState: () => {
            return INITIAL_STATE.dashboard;
        },
    },
});

export const { setTitles, resetDashboardState, setSiteHealth } = dashboardSlice.actions;
export default dashboardSlice.reducer;
