import axiosInstance from "./axios-instance"
import type { 
  ApiItem, 
  Model, 
  Dataset, 
  Analytics, 
  ApiResponse,
  UserPreferences
} from "@/types"
import { API_ENDPOINTS } from "@/constant/api-end-point-constant";

// API endpoints


// API service
export const apiService = {
  // ============================================================================
  // API MANAGEMENT
  // ============================================================================

  // Get all APIs
  getApis: async (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    type?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => {
    const response = await axiosInstance.get<ApiResponse<{
      data: ApiItem[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>>(API_ENDPOINTS.APIS, { params })
    return response
  },

  // Get API details
  getApiDetails: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<ApiItem>>(API_ENDPOINTS.API_DETAILS(id))
    return response
  },

  // Create API
  createApi: async (apiData: Partial<ApiItem>) => {
    const response = await axiosInstance.post<ApiResponse<ApiItem>>(API_ENDPOINTS.APIS, apiData)
    return response
  },

  // Update API
  updateApi: async (id: string, apiData: Partial<ApiItem>) => {
    const response = await axiosInstance.put<ApiResponse<ApiItem>>(API_ENDPOINTS.API_DETAILS(id), apiData)
    return response
  },

  // Delete API
  deleteApi: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<{ message: string }>>(API_ENDPOINTS.API_DETAILS(id))
    return response
  },

  // Duplicate API
  duplicateApi: async (id: string) => {
    const response = await axiosInstance.post<ApiResponse<ApiItem>>(API_ENDPOINTS.API_DUPLICATE(id))
    return response
  },

  // Deploy API
  deployApi: async (id: string) => {
    const response = await axiosInstance.post<ApiResponse<ApiItem>>(API_ENDPOINTS.API_DEPLOY(id))
    return response
  },

  // Test API
  testApi: async (id: string, testData: any) => {
    const response = await axiosInstance.post<ApiResponse<any>>(API_ENDPOINTS.API_TEST(id), testData)
    return response
  },

  // Get API documentation
  getApiDocs: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.API_DOCS(id))
    return response
  },

  // Get API logs
  getApiLogs: async (id: string, params?: {
    page?: number
    limit?: number
    level?: string
    startDate?: string
    endDate?: string
  }) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.API_LOGS(id), { params })
    return response
  },

  // ============================================================================
  // MODEL MANAGEMENT
  // ============================================================================

  // Get all models
  getModels: async (params?: {
    page?: number
    limit?: number
    status?: string
    type?: string
  }) => {
    const response = await axiosInstance.get<ApiResponse<{
      data: Model[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>>(API_ENDPOINTS.MODELS, { params })
    return response
  },

  // Get model details
  getModelDetails: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<Model>>(API_ENDPOINTS.MODEL_DETAILS(id))
    return response
  },

  // Create model
  createModel: async (modelData: Partial<Model>) => {
    const response = await axiosInstance.post<ApiResponse<Model>>(API_ENDPOINTS.MODELS, modelData)
    return response
  },

  // Update model
  updateModel: async (id: string, modelData: Partial<Model>) => {
    const response = await axiosInstance.put<ApiResponse<Model>>(API_ENDPOINTS.MODEL_DETAILS(id), modelData)
    return response
  },

  // Delete model
  deleteModel: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<{ message: string }>>(API_ENDPOINTS.MODEL_DETAILS(id))
    return response
  },

  // Train model
  trainModel: async (id: string, config: any) => {
    const response = await axiosInstance.post<ApiResponse<Model>>(API_ENDPOINTS.MODEL_TRAIN(id), config)
    return response
  },

  // Deploy model
  deployModel: async (id: string) => {
    const response = await axiosInstance.post<ApiResponse<Model>>(API_ENDPOINTS.MODEL_DEPLOY(id))
    return response
  },

  // Get model metrics
  getModelMetrics: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.MODEL_METRICS(id))
    return response
  },

  // Get model versions
  getModelVersions: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.MODEL_VERSION(id))
    return response
  },

  // ============================================================================
  // DATASET MANAGEMENT
  // ============================================================================

  // Get all datasets
  getDatasets: async (params?: {
    page?: number
    limit?: number
    type?: string
    status?: string
  }) => {
    const response = await axiosInstance.get<ApiResponse<{
      data: Dataset[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>>(API_ENDPOINTS.DATASETS, { params })
    return response
  },

  // Get dataset details
  getDatasetDetails: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<Dataset>>(API_ENDPOINTS.DATASET_DETAILS(id))
    return response
  },

  // Upload dataset
  uploadDataset: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await axiosInstance.post<ApiResponse<Dataset>>(API_ENDPOINTS.DATASET_UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  },

  // Get dataset preview
  getDatasetPreview: async (id: string, params?: {
    page?: number
    limit?: number
  }) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.DATASET_PREVIEW(id), { params })
    return response
  },

  // Clean dataset
  cleanDataset: async (id: string, config: any) => {
    const response = await axiosInstance.post<ApiResponse<Dataset>>(API_ENDPOINTS.DATASET_CLEAN(id), config)
    return response
  },

  // Export dataset
  exportDataset: async (id: string, format: string) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.DATASET_EXPORT(id), {
      params: { format },
      responseType: 'blob'
    })
    return response
  },

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  // Get analytics
  getAnalytics: async (params?: {
    startDate?: string
    endDate?: string
    apiId?: string
    granularity?: string
  }) => {
    const response = await axiosInstance.get<ApiResponse<Analytics>>(API_ENDPOINTS.ANALYTICS, { params })
    return response
  },

  // Get analytics overview
  getAnalyticsOverview: async () => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.ANALYTICS_OVERVIEW)
    return response
  },

  // Get API-specific analytics
  getApiAnalytics: async (id: string, params?: {
    startDate?: string
    endDate?: string
    granularity?: string
  }) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.ANALYTICS_API(id), { params })
    return response
  },

  // Get usage analytics
  getUsageAnalytics: async (params?: {
    startDate?: string
    endDate?: string
    apiId?: string
  }) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.ANALYTICS_USAGE, { params })
    return response
  },

  // Get performance analytics
  getPerformanceAnalytics: async (params?: {
    startDate?: string
    endDate?: string
    apiId?: string
  }) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.ANALYTICS_PERFORMANCE, { params })
    return response
  },

  // Get revenue analytics
  getRevenueAnalytics: async (params?: {
    startDate?: string
    endDate?: string
    apiId?: string
  }) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.ANALYTICS_REVENUE, { params })
    return response
  },

  // ============================================================================
  // WORKFLOWS
  // ============================================================================

  // Get all workflows
  getWorkflows: async (params?: {
    page?: number
    limit?: number
    status?: string
  }) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.WORKFLOWS, { params })
    return response
  },

  // Get workflow details
  getWorkflowDetails: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.WORKFLOW_DETAILS(id))
    return response
  },

  // Create workflow
  createWorkflow: async (workflowData: any) => {
    const response = await axiosInstance.post<ApiResponse<any>>(API_ENDPOINTS.WORKFLOWS, workflowData)
    return response
  },

  // Update workflow
  updateWorkflow: async (id: string, workflowData: any) => {
    const response = await axiosInstance.put<ApiResponse<any>>(API_ENDPOINTS.WORKFLOW_DETAILS(id), workflowData)
    return response
  },

  // Delete workflow
  deleteWorkflow: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<{ message: string }>>(API_ENDPOINTS.WORKFLOW_DETAILS(id))
    return response
  },

  // Execute workflow
  executeWorkflow: async (id: string, input: any) => {
    const response = await axiosInstance.post<ApiResponse<any>>(API_ENDPOINTS.WORKFLOW_EXECUTE(id), input)
    return response
  },

  // Get workflow logs
  getWorkflowLogs: async (id: string, params?: {
    page?: number
    limit?: number
    level?: string
  }) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.WORKFLOW_LOGS(id), { params })
    return response
  },

  // ============================================================================
  // INTEGRATIONS
  // ============================================================================

  // Get all integrations
  getIntegrations: async (params?: {
    page?: number
    limit?: number
    type?: string
    status?: string
  }) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.INTEGRATIONS, { params })
    return response
  },

  // Get integration details
  getIntegrationDetails: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.INTEGRATION_DETAILS(id))
    return response
  },

  // Create integration
  createIntegration: async (integrationData: any) => {
    const response = await axiosInstance.post<ApiResponse<any>>(API_ENDPOINTS.INTEGRATIONS, integrationData)
    return response
  },

  // Update integration
  updateIntegration: async (id: string, integrationData: any) => {
    const response = await axiosInstance.put<ApiResponse<any>>(API_ENDPOINTS.INTEGRATION_DETAILS(id), integrationData)
    return response
  },

  // Delete integration
  deleteIntegration: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<{ message: string }>>(API_ENDPOINTS.INTEGRATION_DETAILS(id))
    return response
  },

  // Test integration
  testIntegration: async (id: string) => {
    const response = await axiosInstance.post<ApiResponse<any>>(API_ENDPOINTS.INTEGRATION_TEST(id))
    return response
  },

  // Sync integration
  syncIntegration: async (id: string) => {
    const response = await axiosInstance.post<ApiResponse<any>>(API_ENDPOINTS.INTEGRATION_SYNC(id))
    return response
  },

  // ============================================================================
  // TESTING
  // ============================================================================

  // Test endpoint
  testEndpoint: async (id: string, testData: any) => {
    const response = await axiosInstance.post<ApiResponse<any>>(API_ENDPOINTS.TEST_ENDPOINT(id), testData)
    return response
  },

  // Batch test
  batchTest: async (testData: any) => {
    const response = await axiosInstance.post<ApiResponse<any>>(API_ENDPOINTS.TEST_BATCH, testData)
    return response
  },

  // ============================================================================
  // DOCUMENTATION
  // ============================================================================

  // Generate documentation
  generateDocs: async (id: string) => {
    const response = await axiosInstance.post<ApiResponse<any>>(API_ENDPOINTS.DOCS_GENERATE(id))
    return response
  },

  // Export documentation
  exportDocs: async (id: string, format: string) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.DOCS_EXPORT(id), {
      params: { format },
      responseType: 'blob'
    })
    return response
  },

  // Generate SDK
  generateSDK: async (id: string, language: string) => {
    const response = await axiosInstance.post<ApiResponse<any>>(API_ENDPOINTS.SDK_GENERATE(id), { language })
    return response
  },

  // ============================================================================
  // SETTINGS
  // ============================================================================

  // Get user settings
  getSettings: async () => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.SETTINGS)
    return response
  },

  // Update user settings
  updateSettings: async (settings: any) => {
    const response = await axiosInstance.put<ApiResponse<any>>(API_ENDPOINTS.SETTINGS, settings)
    return response
  },

  // Get user preferences
  getPreferences: async () => {
    const response = await axiosInstance.get<ApiResponse<UserPreferences>>(API_ENDPOINTS.SETTINGS_PREFERENCES)
    return response
  },

  // Update user preferences
  updatePreferences: async (preferences: Partial<UserPreferences>) => {
    const response = await axiosInstance.put<ApiResponse<UserPreferences>>(API_ENDPOINTS.SETTINGS_PREFERENCES, preferences)
    return response
  },

  // Get notification settings
  getNotificationSettings: async () => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.SETTINGS_NOTIFICATIONS)
    return response
  },

  // Update notification settings
  updateNotificationSettings: async (notifications: any) => {
    const response = await axiosInstance.put<ApiResponse<any>>(API_ENDPOINTS.SETTINGS_NOTIFICATIONS, notifications)
    return response
  },

  // Get security settings
  getSecurity: async () => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.SETTINGS_SECURITY)
    return response
  },

  // Update security settings
  updateSecurity: async (security: any) => {
    const response = await axiosInstance.put<ApiResponse<any>>(API_ENDPOINTS.SETTINGS_SECURITY, security)
    return response
  },

  // Get integration settings
  getIntegrationSettings: async () => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.SETTINGS_INTEGRATIONS)
    return response
  },

  // Update integration settings
  updateIntegrationSettings: async (integrations: any) => {
    const response = await axiosInstance.put<ApiResponse<any>>(API_ENDPOINTS.SETTINGS_INTEGRATIONS, integrations)
    return response
  },

  // ============================================================================
  // AUTH
  // ============================================================================

  // Login
  login: async (credentials: any) => {
    const response = await axiosInstance.post<ApiResponse<{
      user: any
      token: string
      refreshToken: string
      mfaRequired: boolean
    }>>(API_ENDPOINTS.AUTH_LOGIN, credentials)
    return response
  },

  // Signup
  signup: async (signupData: any) => {
    const response = await axiosInstance.post<ApiResponse<{
      message: string
      userId: string
    }>>(API_ENDPOINTS.AUTH_SIGNUP, signupData)
    return response
  },

  // Email verification
  verifyEmail: async (token: string) => {
    const response = await axiosInstance.post<ApiResponse<{
      message: string
      user: any
    }>>(API_ENDPOINTS.AUTH_VERIFY_EMAIL, { token })
    return response
  },

  // OTP verification
  verifyOtp: async ({ email, otp }: { email: string; otp: string }) => {
    const response = await axiosInstance.post<ApiResponse<{
      message: string
      token?: string
    }>>(API_ENDPOINTS.AUTH_VERIFY_OTP, { email, otp })
    return response
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post<ApiResponse<{
      message: string
    }>>(API_ENDPOINTS.AUTH_FORGOT_PASSWORD, { email })
    return response
  },

  // Reset password
  resetPassword: async (resetData: any) => {
    const response = await axiosInstance.post<ApiResponse<{
      message: string
    }>>(API_ENDPOINTS.AUTH_RESET_PASSWORD, resetData)
    return response
  },

  // Refresh token
  refreshToken: async (refreshToken: string) => {
    const response = await axiosInstance.post<ApiResponse<{
      token: string
      refreshToken: string
    }>>(API_ENDPOINTS.AUTH_REFRESH_TOKEN, { refreshToken })
    return response
  },

  // Logout
  logout: async () => {
    const response = await axiosInstance.post<ApiResponse<{
      message: string
    }>>(API_ENDPOINTS.AUTH_LOGOUT)
    return response
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.AUTH_CURRENT_USER)
    return response
  },

  // Update profile
  updateProfile: async (profileData: any) => {
    const response = await axiosInstance.put<ApiResponse<any>>(API_ENDPOINTS.AUTH_PROFILE, profileData)
    return response
  },

  // Change password
  changePassword: async (passwordData: any) => {
    const response = await axiosInstance.post<ApiResponse<{
      message: string
    }>>(API_ENDPOINTS.AUTH_CHANGE_PASSWORD, passwordData)
    return response
  },

  // MFA Setup
  setupMFA: async (mfaData: any) => {
    const response = await axiosInstance.post<ApiResponse<{
      qrCode: string
      secret: string
    }>>(API_ENDPOINTS.AUTH_MFA_SETUP, mfaData)
    return response
  },

  // MFA Verify
  verifyMFA: async (mfaData: any) => {
    const response = await axiosInstance.post<ApiResponse<{
      message: string
    }>>(API_ENDPOINTS.AUTH_MFA_VERIFY, mfaData)
    return response
  },

  // MFA Disable
  disableMFA: async () => {
    const response = await axiosInstance.post<ApiResponse<{
      message: string
    }>>(API_ENDPOINTS.AUTH_MFA_DISABLE)
    return response
  },

  // Get sessions
  getSessions: async () => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.AUTH_SESSIONS)
    return response
  },

  // Revoke session
  revokeSession: async (sessionId: string) => {
    const response = await axiosInstance.post<ApiResponse<{
      message: string
    }>>(API_ENDPOINTS.AUTH_REVOKE_SESSION, { sessionId })
    return response
  },

  // Get security log
  getSecurityLog: async (params?: {
    page?: number
    limit?: number
    type?: string
  }) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.AUTH_SECURITY_LOG, { params })
    return response
  },

  // Get activity log
  getActivityLog: async (params?: {
    page?: number
    limit?: number
    type?: string
  }) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.AUTH_ACTIVITY_LOG, { params })
    return response
  },

  // ============================================================================
  // BILLING
  // ============================================================================

  // Get subscription
  getSubscription: async () => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.BILLING_SUBSCRIPTION)
    return response
  },

  // Get plans
  getPlans: async () => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.BILLING_PLANS)
    return response
  },

  // Update subscription
  updateSubscription: async (planId: string, billingCycle: 'monthly' | 'yearly') => {
    const response = await axiosInstance.put<ApiResponse<any>>(API_ENDPOINTS.BILLING_SUBSCRIPTION, {
      planId,
      billingCycle
    })
    return response
  },

  // Cancel subscription
  cancelSubscription: async () => {
    const response = await axiosInstance.delete<ApiResponse<any>>(API_ENDPOINTS.BILLING_SUBSCRIPTION)
    return response
  },

  // Get payment methods
  getPaymentMethods: async () => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.BILLING_PAYMENT_METHODS)
    return response
  },

  // Add payment method
  addPaymentMethod: async (paymentData: any) => {
    const response = await axiosInstance.post<ApiResponse<any>>(API_ENDPOINTS.BILLING_PAYMENT_METHODS, paymentData)
    return response
  },

  // Remove payment method
  removePaymentMethod: async (paymentMethodId: string) => {
    const response = await axiosInstance.delete<ApiResponse<any>>(API_ENDPOINTS.BILLING_PAYMENT_METHOD(paymentMethodId))
    return response
  },

  // Get invoices
  getInvoices: async (params?: { page?: number; limit?: number }) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.BILLING_INVOICES, { params })
    return response
  },

  // Download invoice
  downloadInvoice: async (invoiceId: string) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.BILLING_INVOICE_DOWNLOAD(invoiceId), {
      responseType: 'blob'
    })
    return response
  },

  // Get usage
  getUsage: async () => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.BILLING_USAGE)
    return response
  },

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================

  // Get notifications
  getNotifications: async (params?: { page?: number; limit?: number }) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.NOTIFICATIONS, { params })
    return response
  },

  // Get notification details
  getNotificationDetails: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<any>>(API_ENDPOINTS.NOTIFICATION_DETAILS(id))
    return response
  },

  // Mark notification as read
  markNotificationAsRead: async (id: string) => {
    const response = await axiosInstance.post<ApiResponse<any>>(API_ENDPOINTS.NOTIFICATION_MARK_READ(id))
    return response
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async () => {
    const response = await axiosInstance.post<ApiResponse<any>>(API_ENDPOINTS.NOTIFICATION_MARK_ALL_READ)
    return response
  }
}

// Export endpoints for use in other files
export { API_ENDPOINTS } 