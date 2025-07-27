import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { toast } from "sonner"
import type { Integration, ApiResponse, ApiError } from "@/types"
import { apiService } from "@/api/api-service"

// Async thunks
export const fetchIntegrations = createAsyncThunk(
  "integrations/fetchIntegrations",
  async (params?: { page?: number; limit?: number; type?: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.getIntegrations(params)
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to fetch integrations")
      return rejectWithValue(apiError || "Failed to fetch integrations")
    }
  }
)

// State interface
interface IntegrationState {
  integrations: Integration[]
  currentIntegration: Integration | null
  isLoading: boolean
  error: string | null
}

// Initial state
const initialState: IntegrationState = {
  integrations: [],
  currentIntegration: null,
  isLoading: false,
  error: null
}

// Integration slice
const integrationSlice = createSlice({
  name: "integrations",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentIntegration: (state, action: PayloadAction<Integration | null>) => {
      state.currentIntegration = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIntegrations.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchIntegrations.fulfilled, (state, action) => {
        state.isLoading = false
        state.integrations = action.payload
      })
      .addCase(fetchIntegrations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { clearError, setCurrentIntegration } = integrationSlice.actions

export default integrationSlice.reducer 