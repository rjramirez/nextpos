import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: any;
  session: any;
}

const initialState: AuthState = {
  user: null,
  session: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
    },
    clearUser: (state) => {
      state.user = null;
      state.session = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;