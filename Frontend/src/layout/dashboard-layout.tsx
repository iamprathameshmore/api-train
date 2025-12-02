import Navbar from "@/components/custom/dashboard/nav-bar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="relative min-h-screen  tracking-tight">
      <Navbar />
      {/* Responsive main content area */}
      <div className="px-4 sm:px-6 lg:px-36 xl:px-12 py-6 sm:py-8 lg:py-12">
        <Outlet />
      </div>


    </div>
  );
}
