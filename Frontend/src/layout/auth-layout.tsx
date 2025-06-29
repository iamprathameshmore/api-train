import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Left side (form) */}
            <div className="flex items-center justify-center px-4 py-12 bg-white">
                <div className="w-full max-w-md space-y-6">
                    {/* Logo or Title */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome to APItrain</h1>
                        <p className="mt-2 text-sm text-gray-500">Empowering data-driven APIs without code</p>
                    </div>

                    {/* Auth Form goes here */}
                    <div><Outlet /></div>

                    <p className="text-xs text-gray-400 text-center">
                        © {new Date().getFullYear()} Prathamesh More. Built with ❤️ in India.
                    </p>
                </div>
            </div>

            {/* Right side (optional illustration or image) */}
            <div className="hidden md:block bg-gradient-to-tr from-blue-100 to-indigo-100 p-8">
                <div className="h-full w-full flex items-center justify-center">
                    <img
                        src="/assets/auth-illustration.svg"
                        alt="Secure access"
                        className="max-h-[500px] object-contain"
                    />
                </div>
            </div>
        </div>
    )
}
