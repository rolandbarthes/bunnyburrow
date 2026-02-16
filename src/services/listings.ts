import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type QueryConstraint,
  type Timestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import type { Listing, ListingType, ServiceType } from '@/types/listing'

function requireDb() {
  if (!db) {
    throw new Error('Firestore is not configured. Check your .env.local file.')
  }
  return db
}

function requireStorage() {
  if (!storage) {
    throw new Error('Firebase Storage is not configured. Check your .env.local file.')
  }
  return storage
}

export async function uploadRabbitPhoto(file: File): Promise<string> {
  const storageRef = requireStorage()
  const fileId = crypto.randomUUID()
  const extension = file.name.split('.').pop() || 'jpg'
  const photoRef = ref(storageRef, `rabbit-photos/${fileId}.${extension}`)
  await uploadBytes(photoRef, file)
  return getDownloadURL(photoRef)
}

export interface CreateListingData {
  userId: string
  userDisplayName: string
  listingType: ListingType
  title: string
  description: string
  serviceType: ServiceType
  location: string
  dateFrom: Date
  dateTo: Date
  pricePerNight: number
  rabbitPhotoURL?: string
  rabbitName?: string
  experience?: string
}

export async function createListing(data: CreateListingData): Promise<string> {
  const firestore = requireDb()
  const docRef = await addDoc(collection(firestore, 'listings'), {
    ...data,
    dateFrom: data.dateFrom,
    dateTo: data.dateTo,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export interface ListingFilters {
  listingType?: ListingType
  serviceType?: ServiceType
  location?: string
}

function docToListing(id: string, data: Record<string, unknown>): Listing {
  return {
    id,
    userId: data.userId as string,
    userDisplayName: data.userDisplayName as string,
    listingType: data.listingType as ListingType,
    title: data.title as string,
    description: data.description as string,
    serviceType: data.serviceType as ServiceType,
    location: data.location as string,
    dateFrom: data.dateFrom instanceof Date ? data.dateFrom : (data.dateFrom as Timestamp)?.toDate?.() ?? new Date(data.dateFrom as string),
    dateTo: data.dateTo instanceof Date ? data.dateTo : (data.dateTo as Timestamp)?.toDate?.() ?? new Date(data.dateTo as string),
    pricePerNight: data.pricePerNight as number,
    rabbitPhotoURL: (data.rabbitPhotoURL as string) || undefined,
    rabbitName: (data.rabbitName as string) || undefined,
    experience: (data.experience as string) || undefined,
    createdAt: (data.createdAt as Timestamp)?.toDate?.() ?? new Date(),
  }
}

export async function getListings(filters?: ListingFilters): Promise<Listing[]> {
  const firestore = requireDb()
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')]

  if (filters?.listingType) {
    constraints.unshift(where('listingType', '==', filters.listingType))
  }
  if (filters?.serviceType) {
    constraints.unshift(where('serviceType', '==', filters.serviceType))
  }

  const q = query(collection(firestore, 'listings'), ...constraints)
  const snapshot = await getDocs(q)

  let listings = snapshot.docs.map((d) => docToListing(d.id, d.data()))

  if (filters?.location) {
    const search = filters.location.toLowerCase()
    listings = listings.filter((l) => l.location.toLowerCase().includes(search))
  }

  return listings
}

export async function getListingById(id: string): Promise<Listing | null> {
  const firestore = requireDb()
  const snapshot = await getDoc(doc(firestore, 'listings', id))
  if (!snapshot.exists()) return null
  return docToListing(snapshot.id, snapshot.data())
}

export async function deleteListingById(id: string, userId: string): Promise<void> {
  const firestore = requireDb()
  const snapshot = await getDoc(doc(firestore, 'listings', id))
  if (!snapshot.exists()) throw new Error('Listing not found')
  if (snapshot.data().userId !== userId) throw new Error('Not authorized to delete this listing')
  await deleteDoc(doc(firestore, 'listings', id))
}
