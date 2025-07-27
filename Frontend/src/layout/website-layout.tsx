import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router-dom";
import logo from "../../public/api-train.svg";

export default function WebsiteLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground tracking-tight font-bold">

      {/* HEADER */}
      <header className="bg-primary border-b font-bold text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

          {/* Left: Logo + Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight">
              <img src={logo} alt="APItrain Logo" className="w-6 h-6 sm:w-8 sm:h-8 bg-background" />
              {/* <span className=" text-pink-500">APItrain</span> */}
            </Link>

            {/* Navigation Links - Hidden on mobile */}
            <nav className="hidden md:flex items-center gap-2 text-sm font-bold">
              <a href="/#features" className="hover:text-accent transition-colors font-bold">
                <Button variant='link' size='sm' className="font-bold hover:text-accent text-primary-foreground touch-feedback"> Features</Button>
              </a>
              <a href="/#dashboard" className="hover:text-accent transition-colors">
                <Button variant='link' size='sm' className="font-bold hover:text-accent text-primary-foreground touch-feedback">Dashboard</Button>
              </a>
            </nav>
          </div>

          {/* Right: Auth Actions */}
          <div className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
            <Link to="/login" className="hover:text-accent transition-colors">
              <Button variant="link" size="sm" className="text-primary-foreground rounded-none font-bold touch-feedback">Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="default" size="sm" className="bg-accent text-accent-foreground rounded-none touch-feedback">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-12">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-primary border-t py-6 sm:py-8 mt-8 text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center text-sm space-y-4 sm:space-y-0">
          <p className="text-center sm:text-left">© 2025 API Train Made with ❤️ in India.</p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
            <Link to="/about" className="hover:text-accent hover:underline touch-feedback">About</Link>
            <Link to="/help" className="hover:text-accent hover:underline touch-feedback">Help</Link>
            <Link to="/pricing" className="hover:text-accent hover:underline touch-feedback">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
