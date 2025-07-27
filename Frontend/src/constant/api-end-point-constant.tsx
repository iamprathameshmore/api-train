export  const API_ENDPOINTS = {
  // API Management
  APIS: '/apis',
  API_DETAILS: (id: string) => `/apis/${id}`,
  API_DUPLICATE: (id: string) => `/apis/${id}/duplicate`,
  API_DEPLOY: (id: string) => `/apis/${id}/deploy`,
  API_TEST: (id: string) => `/apis/${id}/test`,
  API_DOCS: (id: string) => `/apis/${id}/docs`,
  API_LOGS: (id: string) => `/apis/${id}/logs`,
  
  // Model Management
  MODELS: '/models',
  MODEL_DETAILS: (id: string) => `/models/${id}`,
  MODEL_TRAIN: (id: string) => `/models/${id}/train`,
  MODEL_DEPLOY: (id: string) => `/models/${id}/deploy`,
  MODEL_METRICS: (id: string) => `/models/${id}/metrics`,
  MODEL_VERSION: (id: string) => `/models/${id}/versions`,
  
  // Dataset Management
  DATASETS: '/datasets',
  DATASET_DETAILS: (id: string) => `/datasets/${id}`,
  DATASET_UPLOAD: '/datasets/upload',
  DATASET_PREVIEW: (id: string) => `/datasets/${id}/preview`,
  DATASET_CLEAN: (id: string) => `/datasets/${id}/clean`,
  DATASET_EXPORT: (id: string) => `/datasets/${id}/export`,
  
  // Analytics
  ANALYTICS: '/analytics',
  ANALYTICS_OVERVIEW: '/analytics/overview',
  ANALYTICS_API: (id: string) => `/analytics/apis/${id}`,
  ANALYTICS_USAGE: '/analytics/usage',
  ANALYTICS_PERFORMANCE: '/analytics/performance',
  ANALYTICS_REVENUE: '/analytics/revenue',
  
  // Workflows
  WORKFLOWS: '/workflows',
  WORKFLOW_DETAILS: (id: string) => `/workflows/${id}`,
  WORKFLOW_EXECUTE: (id: string) => `/workflows/${id}/execute`,
  WORKFLOW_LOGS: (id: string) => `/workflows/${id}/logs`,
  
  // Integrations
  INTEGRATIONS: '/integrations',
  INTEGRATION_DETAILS: (id: string) => `/integrations/${id}`,
  INTEGRATION_TEST: (id: string) => `/integrations/${id}/test`,
  INTEGRATION_SYNC: (id: string) => `/integrations/${id}/sync`,
  
  // Testing
  TEST_CONSOLE: '/test-console',
  TEST_ENDPOINT: (id: string) => `/apis/${id}/test-endpoint`,
  TEST_BATCH: '/test-batch',
  
  // Documentation
  DOCS_GENERATE: (id: string) => `/apis/${id}/docs/generate`,
  DOCS_EXPORT: (id: string) => `/apis/${id}/docs/export`,
  SDK_GENERATE: (id: string) => `/apis/${id}/sdk/generate`,
  
  // Settings
  SETTINGS: '/settings',
  SETTINGS_PREFERENCES: '/settings/preferences',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_SECURITY: '/settings/security',
  SETTINGS_INTEGRATIONS: '/settings/integrations',
  
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_SIGNUP: '/auth/signup',
  AUTH_VERIFY_EMAIL: '/auth/verify-email',
  AUTH_VERIFY_OTP: '/auth/verify-otp',
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/auth/reset-password',
  AUTH_REFRESH_TOKEN: '/auth/refresh-token',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_MFA_SETUP: '/auth/mfa/setup',
  AUTH_MFA_VERIFY: '/auth/mfa/verify',
  AUTH_MFA_DISABLE: '/auth/mfa/disable',
  AUTH_PROFILE: '/auth/profile',
  AUTH_CHANGE_PASSWORD: '/auth/change-password',
  AUTH_CURRENT_USER: '/auth/me',
  AUTH_SESSIONS: '/auth/sessions',
  AUTH_REVOKE_SESSION: '/auth/sessions/revoke',
  AUTH_SECURITY_LOG: '/auth/security-log',
  AUTH_ACTIVITY_LOG: '/auth/activity-log',
  
  // Billing
  BILLING_SUBSCRIPTION: '/billing/subscription',
  BILLING_PLANS: '/billing/plans',
  BILLING_PAYMENT_METHODS: '/billing/payment-methods',
  BILLING_PAYMENT_METHOD: (id: string) => `/billing/payment-methods/${id}`,
  BILLING_INVOICES: '/billing/invoices',
  BILLING_INVOICE_DOWNLOAD: (id: string) => `/billing/invoices/${id}/download`,
  BILLING_USAGE: '/billing/usage',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_DETAILS: (id: string) => `/notifications/${id}`,
  NOTIFICATION_MARK_READ: (id: string) => `/notifications/${id}/read`,
  NOTIFICATION_MARK_ALL_READ: '/notifications/mark-all-read'
}