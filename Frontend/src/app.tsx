// src/routes/router.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom"

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
import ApiDetailPage from "@/app/dashboard/api/api-detail-page"
import UpdateApiPage from "@/app/dashboard/api/update-api-page"
import AuditLogPage from "@/app/dashboard/api/audit-log-page"
import ApiLayout from "@/layout/api-layout"
import ContactPage from "./app/website/contact-page"


export default function App() {

    const router = createBrowserRouter([
        {
            element: <WebsiteLayout />,
            children: [
                {
                    path: ROUTES.HOME, // "/"
                    element: <LandingPage />,
                },
                {
                    path: ROUTES.CONTACT, // "/about"
                    element: <ContactPage />,
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
    return (
        <RouterProvider router={router} />
    )
}



