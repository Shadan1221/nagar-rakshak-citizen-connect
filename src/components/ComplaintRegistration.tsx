import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Camera, MapPin, Send, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ComplaintRegistrationProps {
  onBack: () => void
}

const ComplaintRegistration = ({ onBack }: ComplaintRegistrationProps) => {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [complaintId, setComplaintId] = useState<string>('')
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    state: '',
    city: '',
    issueType: '',
    description: '',
    media: null as File | null
  })

  const issueTypes = [
    { value: 'streetlight', label: '🔦 Street Light Issues', category: 'Infrastructure' },
    { value: 'pothole', label: '🕳️ Pothole/Road Damage', category: 'Roads' },
    { value: 'garbage', label: '🗑️ Garbage Collection', category: 'Sanitation' },
    { value: 'drainage', label: '🌊 Drainage Problems', category: 'Water' },
    { value: 'water', label: '💧 Water Supply Issues', category: 'Water' },
    { value: 'electricity', label: '⚡ Power Outage', category: 'Utilities' },
    { value: 'noise', label: '🔊 Noise Pollution', category: 'Environment' },
    { value: 'others', label: '📝 Other Issues', category: 'General' }
  ]

  const states = [
    'Andhra Pradesh', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Gujarat', 
    'Rajasthan', 'West Bengal', 'Delhi', 'Others'
  ]

  const handleSubmit = () => {
    if (!formData.state || !formData.city || !formData.issueType || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      })
      return
    }

    // Generate complaint ID
    const id = `NGR${Date.now().toString().slice(-6)}`
    setComplaintId(id)
    setStep('success')
    
    toast({
      title: "Report Submitted Successfully! 🎉",
      description: `Complaint ID: ${id}`,
      variant: "default"
    })
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, media: file }))
      toast({
        title: "Media Uploaded",
        description: "Photo/video attached successfully",
        variant: "default"
      })
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-civic-green-light to-background p-6">
        <div className="max-w-md mx-auto pt-8">
          <Card className="border-civic-green border-2 shadow-success">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <CheckCircle className="h-20 w-20 text-civic-green mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-civic-green mb-2">
                  Report Submitted Successfully! 🎉
                </h2>
              </div>

              <div className="bg-civic-green/10 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Your Complaint ID</p>
                <p className="text-2xl font-bold text-civic-green font-mono">{complaintId}</p>
              </div>

              <div className="bg-gradient-to-r from-civic-saffron/10 to-civic-green/10 rounded-lg p-4 mb-6">
                <p className="font-semibold text-civic-saffron text-lg mb-2">
                  🙏 You are a Responsible Citizen of India
                </p>
                <p className="font-bold text-civic-green">
                  Truly a Nagar Rakshak!
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  variant="civic" 
                  size="lg" 
                  className="w-full"
                  onClick={() => onBack()}
                >
                  Track This Complaint
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={() => {
                    setStep('form')
                    setFormData({
                      state: '',
                      city: '',
                      issueType: '',
                      description: '',
                      media: null
                    })
                  }}
                >
                  Register New Complaint
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-civic-orange-light to-background">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-civic-saffron/20">
        <div className="flex items-center p-4 max-w-md mx-auto">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-3">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Register New Complaint</h1>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto">
        <Card className="shadow-lg border-civic-saffron/20">
          <CardHeader className="bg-gradient-to-r from-civic-saffron/5 to-civic-green/5">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-civic-saffron" />
              Issue Details
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Location */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="state">State / UT *</Label>
                <Select value={formData.state} onValueChange={(value) => setFormData(prev => ({...prev, state: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="city">City / District *</Label>
                <Input 
                  placeholder="Enter city or district"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({...prev, city: e.target.value}))}
                />
              </div>
            </div>

            {/* Issue Type */}
            <div>
              <Label>Issue Type *</Label>
              <Select value={formData.issueType} onValueChange={(value) => setFormData(prev => ({...prev, issueType: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  {issueTypes.map(issue => (
                    <SelectItem key={issue.value} value={issue.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{issue.label}</span>
                        <Badge variant="secondary" className="ml-2">{issue.category}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea 
                placeholder="Describe the issue in detail..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              />
            </div>

            {/* Media Upload */}
            <div>
              <Label>Upload Photo/Video (Optional)</Label>
              <div className="border-2 border-dashed border-civic-saffron/30 rounded-lg p-4 text-center hover:border-civic-saffron/50 transition-colors">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                  id="media-upload"
                />
                <label htmlFor="media-upload" className="cursor-pointer">
                  <Camera className="h-8 w-8 text-civic-saffron mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {formData.media ? formData.media.name : 'Tap to add photo or video'}
                  </p>
                  <p className="text-xs text-civic-saffron mt-1">GPS location will be automatically captured</p>
                </label>
              </div>
            </div>

            <Button 
              variant="civic" 
              size="xl" 
              className="w-full"
              onClick={handleSubmit}
            >
              <Send className="h-5 w-5 mr-2" />
              Submit Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ComplaintRegistration