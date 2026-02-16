import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/context/AuthContext'
import { createListing, uploadRabbitPhoto } from '@/services/listings'
import type { ServiceType } from '@/types/listing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CreateListingPage() {
  const { user, userProfile, activeRole } = useAuth()
  const navigate = useNavigate()

  const isOwner = activeRole === 'owner'

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [serviceType, setServiceType] = useState<ServiceType>('both')
  const [location, setLocation] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [pricePerNight, setPricePerNight] = useState('')
  const [rabbitName, setRabbitName] = useState('')
  const [rabbitPhoto, setRabbitPhoto] = useState<File | null>(null)
  const [rabbitPhotoPreview, setRabbitPhotoPreview] = useState<string | null>(null)
  const [experience, setExperience] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setRabbitPhoto(file)
    const reader = new FileReader()
    reader.onloadend = () => setRabbitPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user || !userProfile) return

    setError('')
    setSubmitting(true)

    try {
      let rabbitPhotoURL: string | undefined
      if (rabbitPhoto) {
        rabbitPhotoURL = await uploadRabbitPhoto(rabbitPhoto)
      }

      await createListing({
        userId: user.uid,
        userDisplayName: userProfile.displayName,
        listingType: isOwner ? 'owner' : 'sitter',
        title,
        description,
        serviceType,
        location,
        dateFrom: new Date(dateFrom),
        dateTo: new Date(dateTo),
        pricePerNight: parseFloat(pricePerNight),
        ...(isOwner
          ? { rabbitName, rabbitPhotoURL }
          : { experience }),
      })

      navigate('/listings')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center py-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>
            {isOwner ? 'Seeking Care for Your Rabbit' : 'Offering Sitting Services'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isOwner ? 'e.g. Need a sitter for my Holland Lop' : 'e.g. Experienced rabbit sitter available'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={isOwner ? 'Describe your rabbit and care needs...' : 'Describe the services you offer...'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Service Type</Label>
              <Select value={serviceType} onValueChange={(v) => setServiceType(v as ServiceType)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="host">Host (rabbit goes to sitter)</SelectItem>
                  <SelectItem value="visit">Visit (sitter comes to rabbit)</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or area"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateFrom">From</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo">To</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per Night ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={pricePerNight}
                onChange={(e) => setPricePerNight(e.target.value)}
                placeholder="25.00"
                required
              />
            </div>

            {isOwner ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="rabbitName">Rabbit Name</Label>
                  <Input
                    id="rabbitName"
                    value={rabbitName}
                    onChange={(e) => setRabbitName(e.target.value)}
                    placeholder="e.g. Biscuit"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rabbitPhoto">Rabbit Photo</Label>
                  <Input
                    id="rabbitPhoto"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                  {rabbitPhotoPreview && (
                    <img
                      src={rabbitPhotoPreview}
                      alt="Rabbit preview"
                      className="mt-2 h-32 w-32 rounded-md object-cover"
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Textarea
                  id="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Describe your experience with rabbits..."
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Listing'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
