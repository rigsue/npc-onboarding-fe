import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentView: null,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setCurrentView: (state, action) => {
            state.currentView = action.payload;
        },
        clearCurentView: (state) => {
            state.currentView = null;
        },
    },
});

export const { setCurrentView, clearCurentView } = uiSlice.actions;
export default uiSlice.reducer;