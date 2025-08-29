import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Search, Clock, CheckCircle, User, MapPin } from "lucide-react"

interface ComplaintTrackingProps {
  onBack: () => void
}

const ComplaintTracking = ({ onBack }: ComplaintTrackingProps) => {
  const [searchId, setSearchId] = useState("")
  const [complaint, setComplaint] = useState<any>(null)

  const handleSearch = () => {
    // Mock complaint data
    setComplaint({
      id: "NGR123456",
      type: "Street Light Issue",
      description: "Street light not working in Sector 5, near park",
      status: "In Progress",
      timeline: [
        { status: "Registered", timestamp: "2024-01-15 10:30 AM", completed: true },
        { status: "Assigned", timestamp: "2024-01-15 02:15 PM", completed: true, authority: "Municipal Corporation", contact: "+91-11-23456789" },
        { status: "In Progress", timestamp: "2024-01-16 09:00 AM", completed: true },
        { status: "Resolved", timestamp: "", completed: false }
      ],
      location: "Sector 5, Dwarka, New Delhi",
      authority: "Delhi Municipal Corporation",
      contact: "+91-11-23456789"
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'registered': return 'bg-civic-saffron/20 text-civic-saffron border-civic-saffron/30'
      case 'assigned': return 'bg-civic-blue/20 text-civic-blue border-civic-blue/30'
      case 'in progress': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'resolved': return 'bg-civic-green/20 text-civic-green border-civic-green/30'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-civic-green-light to-background">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-civic-green/20">
        <div className="flex items-center p-4 max-w-md mx-auto">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-3">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Track Complaint</h1>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-6">
        {/* Search Section */}
        <Card className="border-civic-green/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-civic-green" />
              Enter Complaint ID
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="complaint-id">Complaint ID</Label>
              <Input 
                id="complaint-id"
                placeholder="e.g., NGR123456"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </div>
            <Button 
              variant="default" 
              className="w-full bg-civic-green hover:bg-civic-green/90"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4 mr-2" />
              Track Status
            </Button>
          </CardContent>
        </Card>

        {/* Complaint Details */}
        {complaint && (
          <div className="space-y-4">
            {/* Complaint Info */}
            <Card className="border-civic-saffron/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{complaint.type}</span>
                  <Badge className={getStatusColor(complaint.status)}>
                    {complaint.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-civic-saffron mt-1" />
                  <p className="text-sm">{complaint.location}</p>
                </div>
                <p className="text-sm text-muted-foreground">{complaint.description}</p>
                <div className="bg-civic-saffron/5 rounded-lg p-3">
                  <p className="text-sm font-medium">Complaint ID: {complaint.id}</p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-civic-green/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-civic-green" />
                  Status Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complaint.timeline.map((step: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-4 h-4 rounded-full mt-1 ${
                        step.completed 
                          ? 'bg-civic-green' 
                          : index === complaint.timeline.findIndex((s: any) => !s.completed)
                            ? 'bg-civic-saffron animate-pulse'
                            : 'bg-muted'
                      }`} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-medium ${
                            step.completed ? 'text-civic-green' : 'text-muted-foreground'
                          }`}>
                            {step.status}
                          </p>
                          {step.completed && (
                            <CheckCircle className="h-4 w-4 text-civic-green" />
                          )}
                        </div>
                        
                        {step.timestamp && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {step.timestamp}
                          </p>
                        )}
                        
                        {step.authority && (
                          <div className="bg-civic-blue/5 rounded p-2 text-xs">
                            <div className="flex items-center gap-1 mb-1">
                              <User className="h-3 w-3" />
                              <span className="font-medium">{step.authority}</span>
                            </div>
                            <p className="text-muted-foreground">Contact: {step.contact}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Authority Contact */}
            {complaint.status !== 'Resolved' && (
              <Card className="border-civic-blue/20 bg-civic-blue/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Assigned Authority</h4>
                      <p className="text-sm text-muted-foreground">{complaint.authority}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-civic-blue text-civic-blue hover:bg-civic-blue hover:text-white"
                    >
                      Call: {complaint.contact}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Instructions */}
        {!complaint && (
          <Card className="border-civic-saffron/20 bg-civic-saffron/5">
            <CardContent className="p-4 text-center">
              <Search className="h-12 w-12 text-civic-saffron mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Track Your Complaint</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Enter your complaint ID to see real-time status updates and contact information.
              </p>
              <Badge variant="outline" className="border-civic-saffron text-civic-saffron">
                Real-time Tracking
              </Badge>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ComplaintTracking