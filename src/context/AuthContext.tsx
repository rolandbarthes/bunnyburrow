import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUserProfile, updateActiveRole } from '@/services/auth'
import type { UserRole, UserProfile } from '@/types/user'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  activeRole: UserRole
  setActiveRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeRole, setActiveRoleState] = useState<UserRole>('owner')

  const setActiveRole = useCallback(async (role: UserRole) => {
    setActiveRoleState(role)
    if (user) {
      try {
        await updateActiveRole(user.uid, role)
        setUserProfile((prev) => prev ? { ...prev, activeRole: role } : prev)
      } catch {
        // Revert on failure
        setActiveRoleState(activeRole)
      }
    }
  }, [user, activeRole])

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid)
          setUserProfile(profile)
          if (profile) {
            setActiveRoleState(profile.activeRole)
          }
        } catch {
          setUserProfile(null)
        }
      } else {
        setUserProfile(null)
        setActiveRoleState('owner')
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, activeRole, setActiveRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
