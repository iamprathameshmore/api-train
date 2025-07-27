import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { toast } from "sonner"
import type { 
  AuthState, 
  User, 
  LoginCredentials, 
  SignupData, 
  PasswordReset, 
  MFASetup,
  ApiResponse,
  ApiError 
} from "@/types"
import { tokenStorage } from "@/guards/auth-guard"
import { apiService } from "@/api/api-service"

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiService.login(credentials)
      
      // Store tokens securely
      tokenStorage.setToken(response.data.token)
      tokenStorage.setRefreshToken(response.data.refreshToken)
      
      // Set session expiry (24 hours)
      const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
      tokenStorage.setSessionExpiry(sessionExpiry.toISOString())
      
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Login failed")
      return rejectWithValue(apiError || "Login failed")
    }
  }
)

export const signup = createAsyncThunk(
  "auth/signup",
  async (signupData: SignupData, { rejectWithValue }) => {
    try {
      const response = await apiService.signup(signupData)
      toast.success("Account created successfully! Please check your email for verification.")
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Signup failed")
      return rejectWithValue(apiError || "Signup failed")
    }
  }
)

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await apiService.verifyEmail(token)
      toast.success("Email verified successfully!")
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Email verification failed")
      return rejectWithValue(apiError || "Email verification failed")
    }
  }
)

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.verifyOtp({ email, otp })
      toast.success("OTP verified successfully!")
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "OTP verification failed")
      return rejectWithValue(apiError || "OTP verification failed")
    }
  }
)

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await apiService.forgotPassword(email)
      toast.success("Password reset email sent!")
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to send reset email")
      return rejectWithValue(apiError || "Failed to send reset email")
    }
  }
)

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (resetData: PasswordReset, { rejectWithValue }) => {
    try {
      const response = await apiService.resetPassword(resetData)
      toast.success("Password reset successfully!")
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Password reset failed")
      return rejectWithValue(apiError || "Password reset failed")
    }
  }
)

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = tokenStorage.getRefreshToken()
      if (!refreshToken) {
        throw new Error("No refresh token available")
      }
      
      const response = await apiService.refreshToken(refreshToken)
      
      // Update stored tokens
      tokenStorage.setToken(response.data.token)
      tokenStorage.setRefreshToken(response.data.refreshToken)
      
      // Update session expiry
      const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
      tokenStorage.setSessionExpiry(sessionExpiry.toISOString())
      
      return response.data.token
    } catch (error: any) {
      console.error("Token refresh failed:", error)
      return rejectWithValue("Token refresh failed")
    }
  }
)

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Call logout API to invalidate tokens on server
      await apiService.logout()
      
      // Clear local storage
      tokenStorage.clearAll()
      
      toast.success("Logged out successfully")
      return null
    } catch (error: any) {
      console.error("Logout failed:", error)
      // Still clear local storage even if API call fails
      tokenStorage.clearAll()
      return rejectWithValue("Logout failed")
    }
  }
)

export const setupMFA = createAsyncThunk(
  "auth/setupMFA",
  async (mfaData: MFASetup, { rejectWithValue }) => {
    try {
      const response = await apiService.setupMFA(mfaData)
      toast.success("MFA setup completed successfully!")
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "MFA setup failed")
      return rejectWithValue(apiError || "MFA setup failed")
    }
  }
)

export const verifyMFA = createAsyncThunk(
  "auth/verifyMFA",
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await apiService.verifyMFA(code)
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "MFA verification failed")
      return rejectWithValue(apiError || "MFA verification failed")
    }
  }
)

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await apiService.updateProfile(profileData)
      toast.success("Profile updated successfully!")
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Profile update failed")
      return rejectWithValue(apiError || "Profile update failed")
    }
  }
)

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData: { currentPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.changePassword(passwordData)
      toast.success("Password changed successfully!")
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Password change failed")
      return rejectWithValue(apiError || "Password change failed")
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getCurrentUser()
      return response.data
    } catch (error: any) {
      console.error("Failed to get current user:", error)
      return rejectWithValue("Failed to get current user")
    }
  }
)

// Initial state
const initialState: AuthState = {
  user: null,
  token: tokenStorage.getToken(),
  refreshToken: tokenStorage.getRefreshToken(),
  isAuthenticated: false,
  isLoading: false,
  mfaRequired: false,
  sessionExpiry: tokenStorage.getSessionExpiry(),
  error: null
}

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setMFARequired: (state, action: PayloadAction<boolean>) => {
      state.mfaRequired = action.payload
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    setSessionExpiry: (state, action: PayloadAction<string>) => {
      state.sessionExpiry = action.payload
      tokenStorage.setSessionExpiry(action.payload)
    },
    // Security actions
    lockAccount: (state) => {
      state.isAuthenticated = false
      state.user = null
      tokenStorage.clearAll()
    },
    updateLastActivity: (state) => {
      if (state.user) {
        state.user.lastLoginAt = new Date().toISOString()
      }
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.mfaRequired = action.payload.mfaRequired || false
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.error = action.payload as string
      })

    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Email verification
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Password reset
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Token refresh
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload
        state.error = null
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.refreshToken = null
        state.error = action.payload as string
      })

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.refreshToken = null
        state.mfaRequired = false
        state.sessionExpiry = null
        state.error = null
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false
        // Still clear state even if API call fails
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.refreshToken = null
        state.mfaRequired = false
        state.sessionExpiry = null
      })

    // MFA
    builder
      .addCase(setupMFA.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(setupMFA.fulfilled, (state, action) => {
        state.isLoading = false
        if (state.user) {
          state.user.mfaEnabled = true
        }
        state.error = null
      })
      .addCase(setupMFA.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(verifyMFA.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyMFA.fulfilled, (state, action) => {
        state.isLoading = false
        state.mfaRequired = false
        state.user = action.payload.user
        state.error = null
      })
      .addCase(verifyMFA.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Profile management
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.error = action.payload as string
      })
  }
})

export const { 
  clearError, 
  setMFARequired, 
  updateUser, 
  setSessionExpiry,
  lockAccount,
  updateLastActivity
} = authSlice.actions

// Selectors
export const selectUser = (state: AuthState) => state.user
export const selectUserRole = (state: AuthState) => state.user?.role
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated
export const selectIsLoading = (state: AuthState) => state.isLoading
export const selectError = (state: AuthState) => state.error
export const selectToken = (state: AuthState) => state.token
export const selectMFARequired = (state: AuthState) => state.mfaRequired
export const selectSessionExpiry = (state: AuthState) => state.sessionExpiry

export default authSlice.reducer
