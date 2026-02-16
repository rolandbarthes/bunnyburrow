import { Link, Outlet } from 'react-router'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <nav className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-bold">
            Bunny Burrow
          </Link>
          <div className="flex gap-4">
            <Link to="/" className="text-sm hover:underline">
              Home
            </Link>
            <Link to="/dashboard" className="text-sm hover:underline">
              Dashboard
            </Link>
            <Link to="/login" className="text-sm hover:underline">
              Login
            </Link>
          </div>
        </nav>
      </header>
      <main className="container mx-auto flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-3 text-center text-sm text-muted-foreground">
          &copy; 2026 Bunny Burrow
        </div>
      </footer>
    </div>
  )
}
