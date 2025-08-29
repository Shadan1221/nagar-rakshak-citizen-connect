import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BarChart3, MapPin, Users, Clock, CheckCircle, AlertTriangle, Filter } from "lucide-react"

interface AdminPortalProps {
  onBack: () => void
}

const AdminPortal = ({ onBack }: AdminPortalProps) => {
  const mockComplaints = [
    {
      id: "NGR123456",
      type: "Street Light",
      location: "Sector 5, Dwarka",
      status: "Pending",
      priority: "Medium",
      time: "2 hours ago",
      department: "Electrical"
    },
    {
      id: "NGR123457", 
      type: "Pothole",
      location: "MG Road, Central Delhi",
      status: "In Progress",
      priority: "High",
      time: "5 hours ago",
      department: "PWD"
    },
    {
      id: "NGR123458",
      type: "Garbage Collection",
      location: "Karol Bagh",
      status: "Resolved", 
      priority: "Low",
      time: "1 day ago",
      department: "Sanitation"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-civic-saffron/20 text-civic-saffron'
      case 'in progress': return 'bg-yellow-100 text-yellow-700'
      case 'resolved': return 'bg-civic-green/20 text-civic-green'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-civic-saffron/20 text-civic-saffron'
      case 'low': return 'bg-civic-green/20 text-civic-green'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-civic-blue/10 to-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-civic-blue/20">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-3">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Municipal Corporation Portal</p>
            </div>
          </div>
          <Badge className="bg-civic-blue text-white">
            Government Official
          </Badge>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-civic-saffron/20">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-8 w-8 text-civic-saffron mx-auto mb-2" />
              <p className="text-2xl font-bold text-civic-saffron">24</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-200">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">12</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>

          <Card className="border-civic-green/20">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-civic-green mx-auto mb-2" />
              <p className="text-2xl font-bold text-civic-green">156</p>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </CardContent>
          </Card>

          <Card className="border-civic-blue/20">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-civic-blue mx-auto mb-2" />
              <p className="text-2xl font-bold text-civic-blue">1,247</p>
              <p className="text-xs text-muted-foreground">Active Citizens</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-civic-saffron/20">
            <CardContent className="p-6 text-center">
              <MapPin className="h-12 w-12 text-civic-saffron mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Live Complaint Map</h3>
              <p className="text-sm text-muted-foreground">View complaints on GIS map</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-civic-green/20">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-12 w-12 text-civic-green mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-sm text-muted-foreground">Performance metrics</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-civic-blue/20">
            <CardContent className="p-6 text-center">
              <Filter className="h-12 w-12 text-civic-blue mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Advanced Filters</h3>
              <p className="text-sm text-muted-foreground">Filter by type, location</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Complaints */}
        <Card className="border-civic-saffron/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Complaints</span>
              <Button variant="outline" size="sm" className="border-civic-saffron text-civic-saffron">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockComplaints.map((complaint) => (
                <div key={complaint.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{complaint.type}</h4>
                      <Badge variant="outline" className="text-xs">{complaint.id}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {complaint.location}
                      </span>
                      <span>{complaint.time}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStatusColor(complaint.status)}>
                        {complaint.status}
                      </Badge>
                      <Badge className={getPriorityColor(complaint.priority)}>
                        {complaint.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {complaint.department}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      Assign
                    </Button>
                    <Button variant="default" size="sm" className="bg-civic-green hover:bg-civic-green/90">
                      Update
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card className="mt-6 border-civic-green/20">
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-civic-green/5 rounded-lg">
                <h4 className="font-semibold">PWD Department</h4>
                <p className="text-2xl font-bold text-civic-green">94%</p>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
              </div>
              
              <div className="text-center p-4 bg-civic-saffron/5 rounded-lg">
                <h4 className="font-semibold">Electrical Dept</h4>
                <p className="text-2xl font-bold text-civic-saffron">87%</p>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
              </div>
              
              <div className="text-center p-4 bg-civic-blue/5 rounded-lg">
                <h4 className="font-semibold">Sanitation Dept</h4>
                <p className="text-2xl font-bold text-civic-blue">91%</p>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminPortal