export type ServiceType = 'host' | 'visit' | 'both'
export type ListingType = 'owner' | 'sitter'

export interface Listing {
  id: string
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
  createdAt: Date
}
