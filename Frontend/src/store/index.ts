import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/store/slices/auth-slice'
import apiReducer from '@/store/slices/api-slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    apis: apiReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
