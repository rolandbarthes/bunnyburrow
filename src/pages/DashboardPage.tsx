import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardPage() {
  const { userProfile, activeRole } = useAuth()

  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <h1 className="text-2xl font-bold">
        Welcome{userProfile?.displayName ? `, ${userProfile.displayName}` : ''}!
      </h1>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{userProfile?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Active Role</span>
            <span className="capitalize font-medium">{activeRole}</span>
          </div>
          {userProfile?.createdAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member Since</span>
              <span>{userProfile.createdAt.toLocaleDateString()}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
