import Navbar from "@/components/custom/dashboard/nav-bar";
import { Outlet } from "react-router-dom";
import { Bot, HardDrive } from "lucide-react"; // optional icon
import { Button } from "@/components/ui/button"; // if using shadcn/ui

export default function DashboardLayout() {
  return (
    <div className="relative min-h-screen bg-zinc-100 tracking-tight">
      <Navbar />
      <div className="mx-28 py-12">
        <Outlet />
      </div>

      {/* Chatbot Button */}
      <div className="fixed bottom-5 left-36 z-50 ">
        <Button
          // size="icon"
          className=" rounded-none"
          variant='outline'
          onClick={() => {
            // Your chatbot open logic here (modal or iframe)
            alert("Chatbot opened!");
          }}
        >
          <HardDrive className="h-20 w-20" height={100} width={100} />
          <span>System</span>
        </Button>
      </div>
      <div className="fixed bottom-5 right-36 z-50 ">
        <Button
          size="icon"
          className="w-10 h-10 rounded-none"
          onClick={() => {
            // Your chatbot open logic here (modal or iframe)
            alert("Chatbot opened!");
          }}
        >
          <Bot className="h-20 w-20" height={100} width={100} />
        </Button>
      </div>
    </div>
  );
}
