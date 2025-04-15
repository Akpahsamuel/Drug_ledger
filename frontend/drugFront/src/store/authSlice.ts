import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  userRole: string | null;
  token: string | null;
  lastActivity: number | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userRole: null,
  token: null,
  lastActivity: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ role: string; token: string }>) => {
      state.isAuthenticated = true;
      state.userRole = action.payload.role;
      state.token = action.payload.token;
      state.lastActivity = Date.now();
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userRole = null;
      state.token = null;
      state.lastActivity = null;
    },
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },
  },
});

export const { login, logout, updateLastActivity } = authSlice.actions;
export default authSlice.reducer; 