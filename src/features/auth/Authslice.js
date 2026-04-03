import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
 
const BASE_URL = import.meta.env.VITE_BASE_URL;
 
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
 
      const data = await res.json();
 
      if (!res.ok) {
        return rejectWithValue(data.message || "Invalid email or password.");
      }
 
      localStorage.setItem("token", data.token);
      return { token: data.token, email };
    } catch (err) {
      return rejectWithValue("Network error. Please try again.");
    }
  }
);
 
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!localStorage.getItem("token"),
    user: null,
    token: localStorage.getItem("token") || null,
    error: null,
    loading: false,
  },
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = { email: action.payload.email };
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});
 
export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;