import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { toast } from "sonner"
import type { UserPreferences, ApiResponse, ApiError } from "@/types"
import { apiService } from "@/api/api-service"

// Async thunks
export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getSettings()
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to fetch settings")
      return rejectWithValue(apiError || "Failed to fetch settings")
    }
  }
)

export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (settings: Partial<UserPreferences>, { rejectWithValue }) => {
    try {
      const response = await apiService.updateSettings(settings)
      toast.success("Settings updated successfully!")
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to update settings")
      return rejectWithValue(apiError || "Failed to update settings")
    }
  }
)

// State interface
interface SettingsState {
  preferences: UserPreferences | null
  isLoading: boolean
  error: string | null
}

// Initial state
const initialState: SettingsState = {
  preferences: null,
  isLoading: false,
  error: null
}

// Settings slice
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      if (state.preferences) {
        state.preferences.theme = action.payload
      }
    },
    updateLanguage: (state, action: PayloadAction<string>) => {
      if (state.preferences) {
        state.preferences.language = action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.isLoading = false
        state.preferences = action.payload
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateSettings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.isLoading = false
        state.preferences = action.payload
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { clearError, updateTheme, updateLanguage } = settingsSlice.actions

export default settingsSlice.reducer 