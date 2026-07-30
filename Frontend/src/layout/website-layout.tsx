import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router-dom";
import logo from "../../public/api-train.svg";
import { Github, Linkedin, LinkedinIcon, Mail } from "lucide-react";
import { ROUTES } from "@/constant/route-constant";

export default function WebsiteLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground tracking-tight ">

      {/* HEADER */}
      <header className="bg-primary border-b font-bold text-primary-foreground px-36">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

          {/* Left: Logo + Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant='outline' size='sm' className="text-black rounded-none h-full  touch-feedback text-xl"> APITrain</Button>


            {/* Navigation Links - Hidden on mobile */}
            <nav className="hidden md:flex items-center gap-2 text-sm ">

              <Link to={ROUTES.ABOUT}>
                <Button variant='link' size='sm' className=" hover:text-accent text-primary-foreground touch-feedback text-sm">Connectors</Button>
              </Link>
              <Link to={ROUTES.ABOUT}>
                <Button variant='link' size='sm' className=" hover:text-accent text-primary-foreground touch-feedback text-sm">About</Button>
              </Link>
              <Link to={ROUTES.ABOUT}>
                <Button variant='link' size='sm' className=" hover:text-accent text-primary-foreground touch-feedback text-sm">Help</Button>
              </Link>
            </nav>
          </div>

          {/* Right: Auth Actions */}
          <div className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
            <Link to="/login" className="hover:text-accent transition-colors">
              <Button variant="link" size="sm" className="text-primary-foreground rounded-none font-bold touch-feedback">Login</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-accent text-accent-foreground rounded-none touch-feedback hover:text-white hover:border-white border">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1  sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-12 px-36">
        <div className="px-36">
          <Outlet />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-primary border-t py-6 sm:py-8 mt-8 text-primary-foreground px-36">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center text-sm space-y-4 sm:space-y-0">
          <p className="text-center sm:text-left">© 2025 API Train Made with ❤️ in India.</p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
            <Link to="/about" className="hover:text-accent hover:underline touch-feedback"><Github /></Link>
            <Link to="/pricing" className="hover:text-accent hover:underline touch-feedback"><LinkedinIcon /></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
