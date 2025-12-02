// src/constants/routes.ts

export const ROUTES = {
  // Public Website
  HOME: "/",
  CONTACT: "/contact-us",
  ABOUT: "/about-us",
  HELP: "/help",
  PRICING: "/pricing",

  // Auth
  LOGIN: "/login",
  SIGNUP: "/signup",
  VERIFY_OTP: "/verify",

  // Dashboard
  USER_DASHBOARD: {
    OVERVIEW: '',
    PROFILE: 'profile',
    APIS: 'apis',
    APIS_DETAILS: 'apis/:api',
    BILLING: 'billing',
    INVITE: 'invite',
    SETTINGS: 'settings',

  },

  // Errors
  ERROR_500: "/error-500",
  NOT_FOUND: "*",
}
