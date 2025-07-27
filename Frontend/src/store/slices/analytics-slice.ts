import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { toast } from "sonner"
import type { Analytics, ApiResponse, ApiError } from "@/types"
import { apiService } from "@/api/api-service"

// Async thunks
export const fetchAnalytics = createAsyncThunk(
  "analytics/fetchAnalytics",
  async (params?: { startDate?: string; endDate?: string; apiId?: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.getAnalytics(params)
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to fetch analytics")
      return rejectWithValue(apiError || "Failed to fetch analytics")
    }
  }
)

// State interface
interface AnalyticsState {
  data: Analytics | null
  isLoading: boolean
  error: string | null
}

// Initial state
const initialState: AnalyticsState = {
  data: null,
  isLoading: false,
  error: null
}

// Analytics slice
const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { clearError } = analyticsSlice.actions

export default analyticsSlice.reducer 