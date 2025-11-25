import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LicenseData } from '../../interfaces/interface';

const licenseSlice = createSlice({
    name: 'license',
    initialState: [] as LicenseData[],
    reducers: {
        setLicenses: (state, action: PayloadAction<LicenseData[]>) => {
            return action.payload;
        },
    },
});

export const { setLicenses } = licenseSlice.actions;
export default licenseSlice.reducer;
