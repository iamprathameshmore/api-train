// src/constants/routes.ts

export const ROUTES = {
  // Public Website
  HOME: "/",
  ABOUT: "/about",
  HELP: "/help",
  PRICING: "/pricing",

  // Auth
  LOGIN: "/login",
  SIGNUP: "/signup",
  VERIFY_OTP: "/verify",

  // Dashboard
  DASHBOARD: "/dashboard",

  // API Management
  APIS: "/apis",
  API_CREATE: "/apis/create",
  API_DETAIL: (id: string | number = ":id") => `/apis/${id}`,
  API_UPDATE: (id: string | number = ":id") => `/apis/${id}/update`,

  // User Profile
  PROFILE: "/profile",
  SETTINGS: "/settings",

  // Errors
  ERROR_500: "/error-500",
  NOT_FOUND: "*",
}
