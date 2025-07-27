import { configureStore } from "@reduxjs/toolkit"

// Import slices
import authReducer from "./slices/auth-slice"
import apiReducer from "./slices/api-slice"
import teamReducer from "./slices/team-slice"
import billingReducer from "./slices/billing-slice"
import analyticsReducer from "./slices/analytics-slice"
import notificationReducer from "./slices/notification-slice"
import workflowReducer from "./slices/workflow-slice"
import integrationReducer from "./slices/integration-slice"
import settingsReducer from "./slices/settings-slice"

// Configure store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    api: apiReducer,
    team: teamReducer,
    billing: billingReducer,
    analytics: analyticsReducer,
    notifications: notificationReducer,
    workflows: workflowReducer,
    integrations: integrationReducer,
    settings: settingsReducer
  },
  devTools: import.meta.env.DEV
})

// Export types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Export store
export default store
