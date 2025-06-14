import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCollapse: true,
  isNavHover: false,
};

export const navCollpase = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsCollpase: (state, action) => {
      state.isCollapse = action.payload;
    },
    setMobileHover: (state, action) => {
      state.isNavHover = action.payload;
    },
  },
});

export const { setIsCollpase, setMobileHover } = navCollpase.actions;

export default navCollpase.reducer;
