import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '@/context/AuthContext'
import { getListings } from '@/services/listings'
import type { Listing, ListingType } from '@/types/listing'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const serviceTypeLabels = {
  host: 'Host',
  visit: 'Visit',
  both: 'Both',
} as const

function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Card>
      {listing.rabbitPhotoURL && (
        <img
          src={listing.rabbitPhotoURL}
          alt={listing.rabbitName || 'Rabbit'}
          className="h-40 w-full rounded-t-lg object-cover"
        />
      )}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">{listing.title}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {serviceTypeLabels[listing.serviceType]}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant={listing.listingType === 'owner' ? 'default' : 'outline'} className="text-[10px]">
            {listing.listingType === 'owner' ? 'Seeking Care' : 'Offering Services'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="line-clamp-2 text-muted-foreground">{listing.description}</p>
        {listing.rabbitName && (
          <p>
            <span className="text-muted-foreground">Rabbit:</span> {listing.rabbitName}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{listing.location}</span>
          <span>
            {listing.dateFrom.toLocaleDateString()} – {listing.dateTo.toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">${listing.pricePerNight}/night</span>
          <span className="text-xs text-muted-foreground">by {listing.userDisplayName}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function BrowseListingsPage() {
  const { user } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'all' | ListingType>('all')

  useEffect(() => {
    async function fetchListings() {
      setLoading(true)
      setError('')
      try {
        const filter = tab === 'all' ? undefined : { listingType: tab as ListingType }
        const results = await getListings(filter)
        setListings(results)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listings.')
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [tab])

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Browse Listings</h1>
        {user && (
          <Button asChild>
            <Link to="/listings/new">Create Listing</Link>
          </Button>
        )}
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="owner">Seeking Care</TabsTrigger>
          <TabsTrigger value="sitter">Offering Services</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">Loading listings...</div>
          ) : error ? (
            <div className="py-12 text-center text-destructive">{error}</div>
          ) : listings.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No listings found. {user ? 'Be the first to create one!' : 'Sign in to create a listing.'}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
