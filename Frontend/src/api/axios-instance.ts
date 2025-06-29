// src/services/axios.ts
import axios from "axios"
import { toast } from "sonner"

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

// 🔐 Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 🚨 Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.detail || error.message
    const status = error?.response?.status

    if (status === 401) toast.error("Unauthorized. Please login again.")
    else if (status === 422) toast.error("Validation error.")
    else toast.error(message || "Something went wrong.")

    return Promise.reject(error)
  }
)

export default apiClient
