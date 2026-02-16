import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import type { UserProfile } from '@/types/user'

function requireAuth() {
  if (!auth) {
    throw new Error('Firebase Auth is not configured. Check your .env.local file.')
  }
  return auth
}

function requireDb() {
  if (!db) {
    throw new Error('Firestore is not configured. Check your .env.local file.')
  }
  return db
}

export async function createUserProfileDocument(
  user: User,
  displayName?: string,
): Promise<void> {
  const firestore = requireDb()
  const userRef = doc(firestore, 'users', user.uid)
  const snapshot = await getDoc(userRef)

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName || 'User',
      photoURL: user.photoURL || null,
      activeRole: 'owner',
      createdAt: serverTimestamp(),
    })
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const firestore = requireDb()
  const userRef = doc(firestore, 'users', uid)
  const snapshot = await getDoc(userRef)

  if (!snapshot.exists()) {
    return null
  }

  const data = snapshot.data()
  return {
    uid: data.uid,
    email: data.email,
    displayName: data.displayName,
    photoURL: data.photoURL || undefined,
    activeRole: data.activeRole,
    createdAt: data.createdAt?.toDate() ?? new Date(),
  } as UserProfile
}

export async function updateActiveRole(uid: string, role: UserProfile['activeRole']): Promise<void> {
  const firestore = requireDb()
  const userRef = doc(firestore, 'users', uid)
  await setDoc(userRef, { activeRole: role }, { merge: true })
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
): Promise<User> {
  const firebaseAuth = requireAuth()
  const { user } = await createUserWithEmailAndPassword(firebaseAuth, email, password)
  await updateProfile(user, { displayName })
  await createUserProfileDocument(user, displayName)
  return user
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const firebaseAuth = requireAuth()
  const { user } = await signInWithEmailAndPassword(firebaseAuth, email, password)
  return user
}

export async function signInWithGoogle(): Promise<User> {
  const firebaseAuth = requireAuth()
  const provider = new GoogleAuthProvider()
  const { user } = await signInWithPopup(firebaseAuth, provider)
  await createUserProfileDocument(user)
  return user
}

export async function signOut(): Promise<void> {
  const firebaseAuth = requireAuth()
  await firebaseSignOut(firebaseAuth)
}

export function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.'
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.'
    default:
      return 'An unexpected error occurred. Please try again.'
  }
}
