import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    user: null,
    token: null,
    isAuthenticated: false,
};
const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        login: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        updateToken: (state, action) => {
            state.token = action.payload;
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});

export const { login, updateToken, logout } = authSlice.actions;

export default authSlice.reducer;