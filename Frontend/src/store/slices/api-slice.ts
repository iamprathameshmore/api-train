// store/slices/api-slice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { toast } from "sonner"
import type { 
  ApiItem, 
  Model, 
  Dataset, 
  Analytics, 
  ApiResponse, 
  ApiError,
  LoadingStateData 
} from "@/types"
import { apiService } from "@/api/api-service"

// Async thunks for API management
export const fetchApis = createAsyncThunk(
  "api/fetchApis",
  async (params?: { page?: number; limit?: number; search?: string; status?: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.getApis(params)
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to fetch APIs")
      return rejectWithValue(apiError || "Failed to fetch APIs")
    }
  }
)

export const createApi = createAsyncThunk(
  "api/createApi",
  async (apiData: Partial<ApiItem>, { rejectWithValue }) => {
    try {
      const response = await apiService.createApi(apiData)
      toast.success("API created successfully!")
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to create API")
      return rejectWithValue(apiError || "Failed to create API")
    }
  }
)

export const updateApi = createAsyncThunk(
  "api/updateApi",
  async ({ id, data }: { id: string; data: Partial<ApiItem> }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateApi(id, data)
      toast.success("API updated successfully!")
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to update API")
      return rejectWithValue(apiError || "Failed to update API")
    }
  }
)

export const deleteApi = createAsyncThunk(
  "api/deleteApi",
  async (id: string, { rejectWithValue }) => {
    try {
      await apiService.deleteApi(id)
      toast.success("API deleted successfully!")
      return id
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to delete API")
      return rejectWithValue(apiError || "Failed to delete API")
    }
  }
)

export const duplicateApi = createAsyncThunk(
  "api/duplicateApi",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.duplicateApi(id)
      toast.success("API duplicated successfully!")
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to duplicate API")
      return rejectWithValue(apiError || "Failed to duplicate API")
    }
  }
)

export const deployApi = createAsyncThunk(
  "api/deployApi",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.deployApi(id)
      toast.success("API deployed successfully!")
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to deploy API")
      return rejectWithValue(apiError || "Failed to deploy API")
    }
  }
)

export const getApiDetails = createAsyncThunk(
  "api/getApiDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getApiDetails(id)
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to fetch API details")
      return rejectWithValue(apiError || "Failed to fetch API details")
    }
  }
)

// Model management
export const fetchModels = createAsyncThunk(
  "api/fetchModels",
  async (params?: { page?: number; limit?: number; status?: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.getModels(params)
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to fetch models")
      return rejectWithValue(apiError || "Failed to fetch models")
    }
  }
)

export const createModel = createAsyncThunk(
  "api/createModel",
  async (modelData: Partial<Model>, { rejectWithValue }) => {
    try {
      const response = await apiService.createModel(modelData)
      toast.success("Model created successfully!")
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to create model")
      return rejectWithValue(apiError || "Failed to create model")
    }
  }
)

export const trainModel = createAsyncThunk(
  "api/trainModel",
  async ({ id, config }: { id: string; config: any }, { rejectWithValue }) => {
    try {
      const response = await apiService.trainModel(id, config)
      toast.success("Model training started!")
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to start model training")
      return rejectWithValue(apiError || "Failed to start model training")
    }
  }
)

// Dataset management
export const fetchDatasets = createAsyncThunk(
  "api/fetchDatasets",
  async (params?: { page?: number; limit?: number; type?: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.getDatasets(params)
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to fetch datasets")
      return rejectWithValue(apiError || "Failed to fetch datasets")
    }
  }
)

export const uploadDataset = createAsyncThunk(
  "api/uploadDataset",
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await apiService.uploadDataset(file)
      toast.success("Dataset uploaded successfully!")
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to upload dataset")
      return rejectWithValue(apiError || "Failed to upload dataset")
    }
  }
)

// Analytics
export const fetchAnalytics = createAsyncThunk(
  "api/fetchAnalytics",
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
interface ApiState {
  apis: LoadingStateData<ApiItem[]>
  currentApi: LoadingStateData<ApiItem | null>
  models: LoadingStateData<Model[]>
  datasets: LoadingStateData<Dataset[]>
  analytics: LoadingStateData<Analytics | null>
  filters: {
    search: string
    status: string
    type: string
    dateRange: { start: string; end: string }
  }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  selectedApis: string[]
  isBulkActionLoading: boolean
}

// Initial state
const initialState: ApiState = {
  apis: {
    data: [],
    loading: 'idle',
    error: null
  },
  currentApi: {
    data: null,
    loading: 'idle',
    error: null
  },
  models: {
    data: [],
    loading: 'idle',
    error: null
  },
  datasets: {
    data: [],
    loading: 'idle',
    error: null
  },
  analytics: {
    data: null,
    loading: 'idle',
    error: null
  },
  filters: {
    search: '',
    status: '',
    type: '',
    dateRange: { start: '', end: '' }
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  selectedApis: [],
  isBulkActionLoading: false
}

// API slice
const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    // Filter actions
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload
      state.pagination.page = 1 // Reset to first page
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload
      state.pagination.page = 1
    },
    setTypeFilter: (state, action: PayloadAction<string>) => {
      state.filters.type = action.payload
      state.pagination.page = 1
    },
    setDateRangeFilter: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.filters.dateRange = action.payload
      state.pagination.page = 1
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        status: '',
        type: '',
        dateRange: { start: '', end: '' }
      }
      state.pagination.page = 1
    },

    // Pagination actions
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload
      state.pagination.page = 1
    },

    // Selection actions
    selectApi: (state, action: PayloadAction<string>) => {
      if (!state.selectedApis.includes(action.payload)) {
        state.selectedApis.push(action.payload)
      }
    },
    deselectApi: (state, action: PayloadAction<string>) => {
      state.selectedApis = state.selectedApis.filter(id => id !== action.payload)
    },
    selectAllApis: (state) => {
      state.selectedApis = state.apis.data?.map(api => api.id) || []
    },
    deselectAllApis: (state) => {
      state.selectedApis = []
    },

    // Clear current API
    clearCurrentApi: (state) => {
      state.currentApi = {
        data: null,
        loading: 'idle',
        error: null
      }
    },

    // Clear errors
    clearApiError: (state) => {
      state.apis.error = null
    },
    clearCurrentApiError: (state) => {
      state.currentApi.error = null
    },

    // Update API in list
    updateApiInList: (state, action: PayloadAction<ApiItem>) => {
      if (state.apis.data) {
        const index = state.apis.data.findIndex(api => api.id === action.payload.id)
        if (index !== -1) {
          state.apis.data[index] = action.payload
        }
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch APIs
    builder
      .addCase(fetchApis.pending, (state) => {
        state.apis.loading = 'loading'
        state.apis.error = null
      })
      .addCase(fetchApis.fulfilled, (state, action) => {
        state.apis.loading = 'success'
        state.apis.data = action.payload.data
        state.pagination = {
          page: action.payload.pagination?.page || 1,
          limit: action.payload.pagination?.limit || 10,
          total: action.payload.pagination?.total || 0,
          totalPages: action.payload.pagination?.totalPages || 0
        }
      })
      .addCase(fetchApis.rejected, (state, action) => {
        state.apis.loading = 'error'
        state.apis.error = action.payload as string
      })

    // Create API
    builder
      .addCase(createApi.pending, (state) => {
        state.apis.loading = 'loading'
      })
      .addCase(createApi.fulfilled, (state, action) => {
        state.apis.loading = 'success'
        if (state.apis.data) {
          state.apis.data.unshift(action.payload)
        }
      })
      .addCase(createApi.rejected, (state, action) => {
        state.apis.loading = 'error'
        state.apis.error = action.payload as string
      })

    // Update API
    builder
      .addCase(updateApi.pending, (state) => {
        state.apis.loading = 'loading'
      })
      .addCase(updateApi.fulfilled, (state, action) => {
        state.apis.loading = 'success'
        // Update in both lists
        if (state.apis.data) {
          const index = state.apis.data.findIndex(api => api.id === action.payload.id)
          if (index !== -1) {
            state.apis.data[index] = action.payload
          }
        }
        if (state.currentApi.data?.id === action.payload.id) {
          state.currentApi.data = action.payload
        }
      })
      .addCase(updateApi.rejected, (state, action) => {
        state.apis.loading = 'error'
        state.apis.error = action.payload as string
      })

    // Delete API
    builder
      .addCase(deleteApi.pending, (state) => {
        state.isBulkActionLoading = true
      })
      .addCase(deleteApi.fulfilled, (state, action) => {
        state.isBulkActionLoading = false
        // Remove from lists
        if (state.apis.data) {
          state.apis.data = state.apis.data.filter(api => api.id !== action.payload)
        }
        if (state.currentApi.data?.id === action.payload) {
          state.currentApi.data = null
        }
        state.selectedApis = state.selectedApis.filter(id => id !== action.payload)
      })
      .addCase(deleteApi.rejected, (state, action) => {
        state.isBulkActionLoading = false
        state.apis.error = action.payload as string
      })

    // Duplicate API
    builder
      .addCase(duplicateApi.pending, (state) => {
        state.apis.loading = 'loading'
      })
      .addCase(duplicateApi.fulfilled, (state, action) => {
        state.apis.loading = 'success'
        if (state.apis.data) {
          state.apis.data.unshift(action.payload)
        }
      })
      .addCase(duplicateApi.rejected, (state, action) => {
        state.apis.loading = 'error'
        state.apis.error = action.payload as string
      })

    // Deploy API
    builder
      .addCase(deployApi.pending, (state) => {
        state.apis.loading = 'loading'
      })
      .addCase(deployApi.fulfilled, (state, action) => {
        state.apis.loading = 'success'
        // Update API status
        if (state.apis.data) {
          const index = state.apis.data.findIndex(api => api.id === action.payload.id)
          if (index !== -1) {
            state.apis.data[index] = action.payload
          }
        }
        if (state.currentApi.data?.id === action.payload.id) {
          state.currentApi.data = action.payload
        }
      })
      .addCase(deployApi.rejected, (state, action) => {
        state.apis.loading = 'error'
        state.apis.error = action.payload as string
      })

    // Get API Details
    builder
      .addCase(getApiDetails.pending, (state) => {
        state.currentApi.loading = 'loading'
        state.currentApi.error = null
      })
      .addCase(getApiDetails.fulfilled, (state, action) => {
        state.currentApi.loading = 'success'
        state.currentApi.data = action.payload
      })
      .addCase(getApiDetails.rejected, (state, action) => {
        state.currentApi.loading = 'error'
        state.currentApi.error = action.payload as string
      })

    // Fetch Models
    builder
      .addCase(fetchModels.pending, (state) => {
        state.models.loading = 'loading'
        state.models.error = null
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.models.loading = 'success'
        state.models.data = action.payload.data
      })
      .addCase(fetchModels.rejected, (state, action) => {
        state.models.loading = 'error'
        state.models.error = action.payload as string
      })

    // Create Model
    builder
      .addCase(createModel.pending, (state) => {
        state.models.loading = 'loading'
      })
      .addCase(createModel.fulfilled, (state, action) => {
        state.models.loading = 'success'
        if (state.models.data) {
          state.models.data.unshift(action.payload)
        }
      })
      .addCase(createModel.rejected, (state, action) => {
        state.models.loading = 'error'
        state.models.error = action.payload as string
      })

    // Train Model
    builder
      .addCase(trainModel.pending, (state) => {
        state.models.loading = 'loading'
      })
      .addCase(trainModel.fulfilled, (state, action) => {
        state.models.loading = 'success'
        // Update model status
        if (state.models.data) {
          const index = state.models.data.findIndex(model => model.id === action.payload.id)
          if (index !== -1) {
            state.models.data[index] = action.payload
          }
        }
      })
      .addCase(trainModel.rejected, (state, action) => {
        state.models.loading = 'error'
        state.models.error = action.payload as string
      })

    // Fetch Datasets
    builder
      .addCase(fetchDatasets.pending, (state) => {
        state.datasets.loading = 'loading'
        state.datasets.error = null
      })
      .addCase(fetchDatasets.fulfilled, (state, action) => {
        state.datasets.loading = 'success'
        state.datasets.data = action.payload.data
      })
      .addCase(fetchDatasets.rejected, (state, action) => {
        state.datasets.loading = 'error'
        state.datasets.error = action.payload as string
      })

    // Upload Dataset
    builder
      .addCase(uploadDataset.pending, (state) => {
        state.datasets.loading = 'loading'
      })
      .addCase(uploadDataset.fulfilled, (state, action) => {
        state.datasets.loading = 'success'
        if (state.datasets.data) {
          state.datasets.data.unshift(action.payload)
        }
      })
      .addCase(uploadDataset.rejected, (state, action) => {
        state.datasets.loading = 'error'
        state.datasets.error = action.payload as string
      })

    // Fetch Analytics
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.analytics.loading = 'loading'
        state.analytics.error = null
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.analytics.loading = 'success'
        state.analytics.data = action.payload
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.analytics.loading = 'error'
        state.analytics.error = action.payload as string
      })
  }
})

export const {
  setSearchFilter,
  setStatusFilter,
  setTypeFilter,
  setDateRangeFilter,
  clearFilters,
  setPage,
  setLimit,
  selectApi,
  deselectApi,
  selectAllApis,
  deselectAllApis,
  clearCurrentApi,
  clearApiError,
  clearCurrentApiError,
  updateApiInList
} = apiSlice.actions

export default apiSlice.reducer
