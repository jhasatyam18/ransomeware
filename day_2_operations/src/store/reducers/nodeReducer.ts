import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state
interface NodeState {
    nodes: Record<string, any>[]; // Nodes as an array
    selectedNodes: Record<string, any>; // Selected nodes as a key-value map
}

const INITIAL_STATE: NodeState = {
    nodes: [],
    selectedNodes: {},
};

// Define action payload types
interface NodeAddProps {
    data: Record<string, any>[];
}

interface NodeTableSelectionProps {
    data: Record<string, any>;
    isSelected: boolean;
    primaryKey: string;
}

// Create the slice
const nodeSlice = createSlice({
    name: 'nodes',
    initialState: INITIAL_STATE,
    reducers: {
        addNodeData: (state, action: PayloadAction<NodeAddProps>) => {
            // Replace entire nodes array
            state.nodes = action.payload.data;
        },
        updateSelectedNodes: (state, action: PayloadAction<NodeTableSelectionProps>) => {
            const { data, isSelected, primaryKey } = action.payload;
            const key = data[primaryKey];

            if (!key) return; // Ensure primaryKey exists on data

            if (isSelected) {
                state.selectedNodes[key] = data;
            } else {
                delete state.selectedNodes[key];
            }
        },
    },
});

// Export actions and reducer
export const { addNodeData, updateSelectedNodes } = nodeSlice.actions;
export default nodeSlice.reducer;
