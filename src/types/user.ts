export type UserRole = 'owner' | 'sitter' | 'admin'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  activeRole: UserRole
  createdAt: Date
}
