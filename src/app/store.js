import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/Authslice";
import adminReducer from "../features/Admin/Adminslice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
  },
});