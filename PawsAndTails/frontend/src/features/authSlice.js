import { createSlice } from "@reduxjs/toolkit";
import { decodeToken } from "../utils/decodeToken";

const tokenFromStorage = localStorage.getItem("token");
const decodedUser = tokenFromStorage ? decodeToken(tokenFromStorage) : null;

console.log("tokenFromStorage:", tokenFromStorage);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: decodedUser,
    token: tokenFromStorage,
    isAuthenticated: !!decodedUser,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token } = action.payload;
      state.token = token;
      state.user = decodeToken(token);
      state.isAuthenticated = !!token;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
