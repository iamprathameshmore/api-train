import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { toast } from "sonner"
import type { Workflow, ApiResponse, ApiError } from "@/types"
import { apiService } from "@/api/api-service"

// Async thunks
export const fetchWorkflows = createAsyncThunk(
  "workflows/fetchWorkflows",
  async (params?: { page?: number; limit?: number; status?: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.getWorkflows(params)
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to fetch workflows")
      return rejectWithValue(apiError || "Failed to fetch workflows")
    }
  }
)

// State interface
interface WorkflowState {
  workflows: Workflow[]
  currentWorkflow: Workflow | null
  isLoading: boolean
  error: string | null
}

// Initial state
const initialState: WorkflowState = {
  workflows: [],
  currentWorkflow: null,
  isLoading: false,
  error: null
}

// Workflow slice
const workflowSlice = createSlice({
  name: "workflows",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentWorkflow: (state, action: PayloadAction<Workflow | null>) => {
      state.currentWorkflow = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkflows.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchWorkflows.fulfilled, (state, action) => {
        state.isLoading = false
        state.workflows = action.payload
      })
      .addCase(fetchWorkflows.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { clearError, setCurrentWorkflow } = workflowSlice.actions

export default workflowSlice.reducer 