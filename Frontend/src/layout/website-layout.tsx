
import { Button } from "@/components/ui/button"
import { Link, Outlet } from "react-router-dom"

export default function WebsiteLayout() {


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="text-2xl font-bold tracking-tight">🚀 APItrain</div>
          <nav className="flex gap-4 items-center text-sm font-medium">
            <a href="/#features" className="hover:text-primary">Features</a>
            <a href="/#dashboard" className="hover:text-primary">Dashboard</a>
            <Link to="/login" className="hover:text-primary">Login</Link>
            <Link to="/signup">
              <Button variant="outline" size="sm">Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1"><Outlet/></main>

      {/* FOOTER */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2025 Prathamesh More. Made with ❤️ in India.</p>
          <div className="space-x-4 mt-2 md:mt-0">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/help" className="hover:underline">Help</Link>
            <Link to="/pricing" className="hover:underline">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
