import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface plan {
    plan: Record<string, any>[];
    vm: Record<string, any>[];
}

interface DataProps {
    data: Record<string, any>;
}

const planSlice = createSlice({
    name: 'plan',
    initialState: { plan: [], vm: [] } as plan,
    reducers: {
        addPlanData: (state: plan, action: PayloadAction<DataProps>) => {
            // Replace the state.nodes with new data
            Object.assign(state.plan, action.payload.data);
        },
        addVmData: (state: plan, action: PayloadAction<DataProps>) => {
            // Replace the state.nodes with new data
            Object.assign(state.vm, action.payload.data);
        },
    },
});
export const { addPlanData, addVmData } = planSlice.actions;
export default planSlice.reducer;
