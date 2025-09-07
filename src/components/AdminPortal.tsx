import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart3, Settings, FileText, LogOut } from "lucide-react"
import AdminLogin from "./AdminLogin"
import AdminAnalytics from "./AdminAnalytics"
import AdminComplaintManagement from "./AdminComplaintManagement"

interface AdminPortalProps {
  onBack: () => void
}

const AdminPortal = ({ onBack }: AdminPortalProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <AdminLogin onBack={onBack} onSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-civic-saffron/5 via-background to-civic-green/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onBack}
              className="border-civic-saffron/20 hover:bg-civic-saffron/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Nagar Rakshak Administrative Portal</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics Dashboard
            </TabsTrigger>
            <TabsTrigger value="complaints" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Complaint Management
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>

          <TabsContent value="complaints">
            <AdminComplaintManagement />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Routing Algorithm Status</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Automatic routing system is active and mapping complaints to authorities based on issue type.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Electricity →</span>
                        <span className="font-medium">Electricity Department</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Water Supply →</span>
                        <span className="font-medium">Jal Board / Water Supply Department</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Garbage Collection →</span>
                        <span className="font-medium">Nagar Nigam / Municipal Corporation</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Road Repair →</span>
                        <span className="font-medium">Public Works Department (PWD)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Street Light →</span>
                        <span className="font-medium">Nagar Nigam / Municipal Corporation (Street Lighting)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Public Transport →</span>
                        <span className="font-medium">Local Transport Authority / RTO</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Noise Pollution →</span>
                        <span className="font-medium">Pollution Control Board / Local Police</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminPortal