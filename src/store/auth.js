import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: {},
  isAuth: false,
  token: "",
  role: "",
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    LoginUser: (state, action) => {
      state.userData = action.payload.userData;
      state.isAuth = action.payload.isAuth;
      state.role = action.payload.role;
      state.token = action.payload.token;
    },
    UpdateUser: (state, action) => {
      state.userData = action.payload;
    },
    LogoutUser: (state) => {
      localStorage.removeItem("authToken");
      state.userData = {};
      state.isAuth = false;
      state.role = "";
      state.token = "";
    },
    IsLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { LoginUser, LogoutUser, IsLoading, UpdateUser } =
  authSlice.actions;

export default authSlice.reducer;
