/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/constant/api-end-point-constant";
import type { SignUp } from "@/types/auth-types";
import { jwtDecode } from "jwt-decode"

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  loading: boolean;
  error?: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  loading: false,
};

// 🔐 Send OTP (Login)
export const login = createAsyncThunk<void, string, { rejectValue: string }>(
  "auth/login",
  async (email, { rejectWithValue }) => {
    try {
      await axiosInstance.post(API_ENDPOINTS.LOGIN, { email });
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to send OTP");
    }
  }
);

// ✍️ Signup
export const signup = createAsyncThunk<void, SignUp, { rejectValue: string }>(
  "auth/signup",
  async (payload, { rejectWithValue }) => {
    try {
      await axiosInstance.post(API_ENDPOINTS.SIGNUP, payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to sign up");
    }
  }
);

// ✅ OTP Verification
export const verifyOtp = createAsyncThunk<string, { email: string; otp: string }, { rejectValue: string }>(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(API_ENDPOINTS.VERIFY_OTP, { email, otp });
      return res.data.data.access_token;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Invalid OTP");
    }
  }
);

// 🔄 Refresh Token
export const refreshAccessToken = createAsyncThunk<string, void, { rejectValue: string }>(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN);
      return res.data.access_token;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Refresh token failed");
    }
  }
);

export const selectUserRole = (state: AuthState) => {
  if (!state.accessToken) return null;
  try {
    const decoded: any = jwtDecode(state.accessToken);
    return decoded.role || null;
  } catch {
    return null;
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.error = undefined;
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("accessToken");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "OTP send failed";
      })

      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup OTP send failed";
      })

      // OTP Verification
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<string>) => {
        const token = action.payload;
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = token;
        if (typeof window !== "undefined") {
          sessionStorage.setItem("accessToken", token);
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "OTP verification failed";
      })

      // Refresh Token
      .addCase(refreshAccessToken.fulfilled, (state, action: PayloadAction<string>) => {
        state.isAuthenticated = true;
        state.accessToken = action.payload;
        if (typeof window !== "undefined") {
          sessionStorage.setItem("accessToken", action.payload);
        }
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.accessToken = null;
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("accessToken");
        }
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
