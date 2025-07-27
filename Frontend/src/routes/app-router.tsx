// src/routes/router.tsx
import { createBrowserRouter } from "react-router-dom"

import LoginForm from "@/app/auth/log-in"
import SignupForm from "@/app/auth/sign-up"
import OTPVerificationScreen from "@/app/auth/verification"
import ApisPage from "@/app/dashboard/api/api-page"
import InternalErrorPage from "@/app/error/internal-server-error-page"
import NotFoundPage from "@/app/error/not-found-page"
import AboutPage from "@/app/website/about-page"
import HelpPage from "@/app/website/help-page"
import LandingPage from "@/app/website/landing-page"
import PricingPage from "@/app/website/pricing-page"
import { ROUTES } from "@/constant/route-constant"
import AuthLayout from "@/layout/auth-layout"
import DashboardLayout from "@/layout/dashboard-layout"
import WebsiteLayout from "@/layout/website-layout"
// import AuthGuard from "@/guards/auth-guard"
import ApiDetailPage from "@/app/dashboard/api/api-detail-page"
import UpdateApiPage from "@/app/dashboard/api/update-api-page"
import AuditLogPage from "@/app/dashboard/api/audit-log-page"
import ProfilePage from "@/app/profile/profile-page"
import HomePage from "@/app/dashboard/home-page"
import BillingPage from "@/app/dashboard/billing-page"
import InvitePage from "@/app/dashboard/invite-page"
import SettingPage from "@/app/dashboard/setting-page"
import ApiLayout from "@/layout/api-layout"

const router = createBrowserRouter([
  {
    element: <WebsiteLayout />,
    children: [
      {
        path: ROUTES.HOME, // "/"
        element: <LandingPage />,
      },
      {
        path: ROUTES.PRICING, // "/pricing"
        element: <PricingPage />,
      },
      {
        path: ROUTES.ABOUT, // "/about"
        element: <AboutPage />,
      },
      {
        path: ROUTES.HELP, // "/help"
        element: <HelpPage />,
      },
    ]
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.LOGIN, // "/login"
        element: <LoginForm />,
      },
      {
        path: ROUTES.SIGNUP, // "/signup"
        element: <SignupForm />,
      },
      {
        path: ROUTES.VERIFY_OTP, // "/verify-otp"
        element: <OTPVerificationScreen />,
      },
    ],
  },
  {
    // element: <AuthGuard />,
    path: "/:username",
    children: [
      {
        element: <DashboardLayout />,
        children: [
                     {
             path: ROUTES.USER_DASHBOARD.OVERVIEW, // ""
             element: <HomePage />,
           },
          {
            path: ROUTES.USER_DASHBOARD.APIS, // "apis"
            element: <ApisPage />,
          },

          {
            path: "apis/:id",
            element: <ApiLayout />, // ✅ Required wrapper component for nested routes
            children: [
              {
                path: "", // /:username/apis/:id
                element: <ApiDetailPage />,
              },
              {
                path: "update", // /:username/apis/:id/update
                element: <UpdateApiPage />,
              },
              {
                path: "logs", // /:username/apis/:id/logs
                element: <AuditLogPage />,
              },
            ],
          },
          {
            path: ROUTES.USER_DASHBOARD.PROFILE, // "profile"
            element: <ProfilePage />,
          },

          {
            path: ROUTES.USER_DASHBOARD.BILLING, // Audit logs (admin only)
            element: <BillingPage />,
          },
                     {
             path: ROUTES.USER_DASHBOARD.INVITE, // Invite team members
             element: <InvitePage />,
           },
          {
            path: ROUTES.USER_DASHBOARD.SETTINGS, // Audit logs (admin only)
            element: <SettingPage />,
          },

        ],
      },
    ]
  },
  {
    path: "/500",
    element: <InternalErrorPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
])

export default router
