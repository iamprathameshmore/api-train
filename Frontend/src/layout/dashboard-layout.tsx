import Navbar from "@/components/custom/dashboard/nav-bar";
import { Outlet } from "react-router-dom";
import { Bot, HardDrive } from "lucide-react"; // optional icon
import { Button } from "@/components/ui/button"; // if using shadcn/ui

export default function DashboardLayout() {
  return (
    <div className="relative min-h-screen bg-zinc-100 tracking-tight">
      <Navbar />
      {/* Responsive main content area */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-12">
        <Outlet />
      </div>

      {/* Mobile-friendly floating action buttons */}
      <div className="fixed bottom-4 left-4 z-50 sm:bottom-5 sm:left-10">
        <Button
          className="rounded-none touch-feedback shadow-lg"
          variant='outline'
          onClick={() => {
            // Your chatbot open logic here (modal or iframe)
            alert("System opened!");
          }}
        >
          <HardDrive className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="hidden sm:inline ml-2">System</span>
        </Button>
      </div>
      
      <div className="fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-10">
        <Button
          size="icon"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-none touch-feedback shadow-lg"
          onClick={() => {
            // Your chatbot open logic here (modal or iframe)
            alert("Chatbot opened!");
          }}
        >
          <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>
    </div>
  );
}
