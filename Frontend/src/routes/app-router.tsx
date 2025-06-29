// src/routes/router.tsx
import { createBrowserRouter } from "react-router-dom"

import LoginForm from "@/app/auth/log-in"
import SignupForm from "@/app/auth/sign-up"
import OTPVerificationScreen from "@/app/auth/verification"
import ApiDetailPage from "@/app/dashboard/api-detail-page"
import ApisPage from "@/app/dashboard/api-page"
import CreateApiPage from "@/app/dashboard/create-api-page"
import UpdateApiPage from "@/app/dashboard/update-api-page"
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

export const router = createBrowserRouter([
  {
    element: <WebsiteLayout />,
    children: [{
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
    element: <DashboardLayout />,
    children: [
      {
        path: ROUTES.DASHBOARD, // "/dashboard"
        element: <ApisPage />,
      },
      {
        path: ROUTES.API_CREATE, // "/apis/create"
        element: <CreateApiPage />,
      },
      {
        path: ROUTES.API_UPDATE(":id"), // "/apis/:id/update"
        element: <UpdateApiPage />,
      },
      {
        path: ROUTES.API_DETAIL(":id"), // "/apis/:id"
        element: <ApiDetailPage />,
      },
    ],
  },
  {
    path: "/error-500",
    element: <InternalErrorPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
])
