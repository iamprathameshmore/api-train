import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router-dom";
import logo from "../../public/api-train.svg";

export default function WebsiteLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground tracking-tight font-bold">

      {/* HEADER */}
      <header className="bg-primary border-b font-bold text-primary-foreground">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">

          {/* Left: Logo + Links */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <img src={logo} alt="APItrain Logo" className="w-8 h-8 bg-background" />
              {/* <span className=" text-pink-500">APItrain</span> */}
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-2 text-sm font-bold">
              <a href="/#features" className="hover:text-accent transition-colors font-bold"><Button variant='link' size='sm' className="font-bold hover:text-accent text-primary-foreground"> Features</Button></a>
              <a href="/#dashboard" className="hover:text-accent transition-colors"><Button variant='link' size='sm' className="font-bold hover:text-accent text-primary-foreground">Dashboard</Button></a>
            </nav>
          </div>

          {/* Right: Auth Actions */}
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link to="/login" className="hover:text-accent transition-colors"><Button variant="link" size="sm" className="text-primary-foreground rounded-none font-bold">Login</Button></Link>
            <Link to="/signup">
              <Button variant="default" size="sm" className="bg-accent text-accent-foreground rounded-none">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:mx-42 md:border my-5">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-primary border-t py-6 mt-8 text-primary-foreground">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-center md:text-left">© 2025 API Train Made with ❤️ in India.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link to="/about" className="hover:text-accent hover:underline">About</Link>
            <Link to="/help" className="hover:text-accent hover:underline">Help</Link>
            <Link to="/pricing" className="hover:text-accent hover:underline">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
