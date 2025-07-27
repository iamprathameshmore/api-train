import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { toast } from "sonner"
import type { 
  Subscription, 
  Plan, 
  PaymentMethod, 
  Invoice, 
  ApiResponse, 
  ApiError 
} from "@/types"
import { apiService } from "@/api/api-service"

// Async thunks
export const fetchSubscription = createAsyncThunk(
  "billing/fetchSubscription",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getSubscription()
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to fetch subscription")
      return rejectWithValue(apiError || "Failed to fetch subscription")
    }
  }
)

export const fetchPlans = createAsyncThunk(
  "billing/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getPlans()
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to fetch plans")
      return rejectWithValue(apiError || "Failed to fetch plans")
    }
  }
)

export const updateSubscription = createAsyncThunk(
  "billing/updateSubscription",
  async ({ planId, billingCycle }: { planId: string; billingCycle: 'monthly' | 'yearly' }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateSubscription(planId, billingCycle)
      toast.success("Subscription updated successfully!")
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to update subscription")
      return rejectWithValue(apiError || "Failed to update subscription")
    }
  }
)

export const cancelSubscription = createAsyncThunk(
  "billing/cancelSubscription",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.cancelSubscription()
      toast.success("Subscription cancelled successfully!")
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to cancel subscription")
      return rejectWithValue(apiError || "Failed to cancel subscription")
    }
  }
)

export const fetchPaymentMethods = createAsyncThunk(
  "billing/fetchPaymentMethods",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getPaymentMethods()
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to fetch payment methods")
      return rejectWithValue(apiError || "Failed to fetch payment methods")
    }
  }
)

export const addPaymentMethod = createAsyncThunk(
  "billing/addPaymentMethod",
  async (paymentData: any, { rejectWithValue }) => {
    try {
      const response = await apiService.addPaymentMethod(paymentData)
      toast.success("Payment method added successfully!")
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to add payment method")
      return rejectWithValue(apiError || "Failed to add payment method")
    }
  }
)

export const removePaymentMethod = createAsyncThunk(
  "billing/removePaymentMethod",
  async (paymentMethodId: string, { rejectWithValue }) => {
    try {
      await apiService.removePaymentMethod(paymentMethodId)
      toast.success("Payment method removed successfully!")
      return paymentMethodId
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to remove payment method")
      return rejectWithValue(apiError || "Failed to remove payment method")
    }
  }
)

export const fetchInvoices = createAsyncThunk(
  "billing/fetchInvoices",
  async (params?: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await apiService.getInvoices(params)
      return response.data
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to fetch invoices")
      return rejectWithValue(apiError || "Failed to fetch invoices")
    }
  }
)

export const downloadInvoice = createAsyncThunk(
  "billing/downloadInvoice",
  async (invoiceId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.downloadInvoice(invoiceId)
      return { invoiceId, data: response.data }
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      toast.error(apiError?.message || "Failed to download invoice")
      return rejectWithValue(apiError || "Failed to download invoice")
    }
  }
)

// State interface
interface BillingState {
  subscription: Subscription | null
  plans: Plan[]
  paymentMethods: PaymentMethod[]
  invoices: Invoice[]
  isLoading: boolean
  error: string | null
  usage: {
    apiCalls: number
    storage: number
    teamMembers: number
    cost: number
  } | null
}

// Initial state
const initialState: BillingState = {
  subscription: null,
  plans: [],
  paymentMethods: [],
  invoices: [],
  isLoading: false,
  error: null,
  usage: null
}

// Billing slice
const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateUsage: (state, action: PayloadAction<any>) => {
      state.usage = action.payload
    }
  },
  extraReducers: (builder) => {
    // Fetch subscription
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.isLoading = false
        state.subscription = action.payload
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch plans
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.isLoading = false
        state.plans = action.payload
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Update subscription
    builder
      .addCase(updateSubscription.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.isLoading = false
        state.subscription = action.payload
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Cancel subscription
    builder
      .addCase(cancelSubscription.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.isLoading = false
        state.subscription = action.payload
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch payment methods
    builder
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.isLoading = false
        state.paymentMethods = action.payload
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Add payment method
    builder
      .addCase(addPaymentMethod.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false
        state.paymentMethods.push(action.payload)
      })
      .addCase(addPaymentMethod.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Remove payment method
    builder
      .addCase(removePaymentMethod.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(removePaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false
        state.paymentMethods = state.paymentMethods.filter(
          method => method.id !== action.payload
        )
      })
      .addCase(removePaymentMethod.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch invoices
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.isLoading = false
        state.invoices = action.payload
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { clearError, updateUsage } = billingSlice.actions

export default billingSlice.reducer 