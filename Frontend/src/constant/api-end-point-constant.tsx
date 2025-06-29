// src/constants/api.ts

export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  VERIFY_OTP: "/auth/verify",
  CURRENT_USER: "/auth/me",

  APIS: "/api/apis",
  API_DETAIL: (id: string | number) => `/api/apis/${id}`,

  PROFILE: "/user/profile",
}
