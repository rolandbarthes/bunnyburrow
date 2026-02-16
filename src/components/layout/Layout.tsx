import { Link, Outlet, useNavigate } from 'react-router'
import { useAuth } from '@/context/AuthContext'
import { signOut } from '@/services/auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Layout() {
  const { user, userProfile, activeRole, setActiveRole } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <nav className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-bold">
            Bunny Burrow
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm hover:underline">
              Home
            </Link>
            <Link to="/listings" className="text-sm hover:underline">
              Browse
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm hover:underline">
                  Dashboard
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={userProfile?.photoURL}
                          alt={userProfile?.displayName || 'User'}
                        />
                        <AvatarFallback>
                          {getInitials(userProfile?.displayName || user.email || 'U')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{userProfile?.displayName || 'User'}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                      Active Role
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => setActiveRole('owner')}
                      className={activeRole === 'owner' ? 'font-semibold' : ''}
                    >
                      {activeRole === 'owner' ? '● ' : '○ '}Owner
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setActiveRole('sitter')}
                      className={activeRole === 'sitter' ? 'font-semibold' : ''}
                    >
                      {activeRole === 'sitter' ? '● ' : '○ '}Sitter
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild variant="default" size="sm">
                <Link to="/login">Sign In</Link>
              </Button>
            )}
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
