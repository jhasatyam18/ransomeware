import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JobInterface } from '../../interfaces/interface';

interface JobProps {
    data: Record<string, any>;
}
const jobSlice = createSlice({
    name: 'jobs',
    initialState: { recovery: [], replication: [] } as JobInterface,
    reducers: {
        addRecoveryJob: (state: JobInterface, action: PayloadAction<JobProps>) => {
            // Replace the state.nodes with new data
            Object.assign(state.recovery, action.payload.data);
        },
        addReplicationJob: (state: JobInterface, action: PayloadAction<JobProps>) => {
            // Replace the state.nodes with new data
            Object.assign(state.replication, action.payload.data);
        },
    },
});
export const { addRecoveryJob, addReplicationJob } = jobSlice.actions;
export default jobSlice.reducer;
