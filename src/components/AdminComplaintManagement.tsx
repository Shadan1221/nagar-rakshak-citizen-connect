import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Search, Filter, Eye, Calendar, MapPin, User, Phone } from "lucide-react"
import { format } from "date-fns"

interface Complaint {
  id: string
  complaint_code: string | null
  issue_type: string | null
  description: string | null
  status: string | null
  priority: string | null
  city: string | null
  state: string | null
  created_at: string
  assigned_to: string | null
  assigned_department: string | null
  display_name: string | null
  address_line1: string | null
  address_line2: string | null
  geo_lat: number | null
  geo_lng: number | null
  gps_latitude: number | null
  gps_longitude: number | null
  location: any | null
  media_url: string | null
  severity_description: string | null
  voice_note_url: string | null
  reporter_hash: string | null
  updated_at: string | null
  user_id: string | null
}

const AdminComplaintManagement = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([])
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    issueType: '',
    area: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchComplaints()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [complaints, filters])

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setComplaints((data || []).map(item => ({
        id: item.id,
        complaint_code: item.complaint_code || '',
        issue_type: item.issue_type || '',
        description: item.description || '',
        status: item.status || '',
        priority: item.priority || '',
        city: item.city || '',
        state: item.state || '',
        created_at: item.created_at,
        assigned_to: item.assigned_to || '',
        assigned_department: item.assigned_department || '',
        display_name: (item as any).display_name || null,
        address_line1: item.address_line1 || null,
        address_line2: item.address_line2 || null,
        geo_lat: item.geo_lat || null,
        geo_lng: item.geo_lng || null,
        gps_latitude: item.gps_latitude || null,
        gps_longitude: item.gps_longitude || null,
        location: item.location || null,
        media_url: item.media_url || null,
        severity_description: item.severity_description || null,
        voice_note_url: item.voice_note_url || null,
        reporter_hash: (item as any).reporter_hash || null,
        updated_at: item.updated_at || null,
        user_id: item.user_id || null
      })))
    } catch (error) {
      console.error('Error fetching complaints:', error)
      toast({
        title: "Error",
        description: "Failed to fetch complaints",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = complaints

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(complaint =>
        complaint.complaint_code?.toLowerCase().includes(searchTerm) ||
        complaint.description?.toLowerCase().includes(searchTerm) ||
        complaint.display_name?.toLowerCase().includes(searchTerm)
      )
    }

    // Issue type filter
    if (filters.issueType) {
      filtered = filtered.filter(complaint => complaint.issue_type === filters.issueType)
    }

    // Area filter
    if (filters.area) {
      filtered = filtered.filter(complaint => 
        complaint.city?.toLowerCase().includes(filters.area.toLowerCase()) ||
        complaint.state?.toLowerCase().includes(filters.area.toLowerCase())
      )
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(complaint => complaint.status === filters.status)
    }

    // Date filters
    if (filters.dateFrom) {
      filtered = filtered.filter(complaint => 
        new Date(complaint.created_at) >= new Date(filters.dateFrom)
      )
    }

    if (filters.dateTo) {
      filtered = filtered.filter(complaint => 
        new Date(complaint.created_at) <= new Date(filters.dateTo)
      )
    }

    setFilteredComplaints(filtered)
  }

  const updateComplaintStatus = async (complaintId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status: newStatus })
        .eq('id', complaintId)

      if (error) throw error

      toast({
        title: "Status Updated",
        description: `Complaint status changed to ${newStatus}`,
        variant: "default"
      })

      fetchComplaints()
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      })
    }
  }
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status: newStatus })
        .eq('id', complaintId)

      if (error) throw error

      toast({
        title: "Status Updated",
        description: `Complaint status changed to ${newStatus}`,
        variant: "default"
      })

      fetchComplaints()
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Registered': return 'bg-yellow-100 text-yellow-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-orange-100 text-orange-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAuthorityForIssue = (issueType: string) => {
    const mapping: { [key: string]: string } = {
      'Electricity': 'Electricity Department',
      'Water Supply': 'Jal Board / Water Supply Department',
      'Garbage Collection': 'Nagar Nigam / Municipal Corporation',
      'Road Repair': 'Public Works Department (PWD)',
      'Street Light': 'Nagar Nigam / Municipal Corporation (Street Lighting Division)',
      'Public Transport': 'Local Transport Authority / RTO',
      'Noise Pollution': 'Pollution Control Board / Local Police Authority'
    }
    return mapping[issueType] || 'General Administration'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-civic-saffron mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading complaints...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search complaints..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            
            <Select value={filters.issueType} onValueChange={(value) => setFilters(prev => ({ ...prev, issueType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Issue Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="Electricity">Electricity</SelectItem>
                <SelectItem value="Water Supply">Water Supply</SelectItem>
                <SelectItem value="Garbage Collection">Garbage Collection</SelectItem>
                <SelectItem value="Road Repair">Road Repair</SelectItem>
                <SelectItem value="Street Light">Street Light</SelectItem>
                <SelectItem value="Public Transport">Public Transport</SelectItem>
                <SelectItem value="Noise Pollution">Noise Pollution</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Area/City"
              value={filters.area}
              onChange={(e) => setFilters(prev => ({ ...prev, area: e.target.value }))}
            />

            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="Registered">Registered</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="From Date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            />

            <Input
              type="date"
              placeholder="To Date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            />
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredComplaints.length} of {complaints.length} complaints
            </p>
            <Button
              variant="outline"
              onClick={() => setFilters({
                search: '', issueType: '', area: '', status: '', dateFrom: '', dateTo: ''
              })}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card>
        <CardHeader>
          <CardTitle>Complaint Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Issue Type</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Authority</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-mono text-sm">
                      {complaint.complaint_code}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{complaint.issue_type}</Badge>
                    </TableCell>
                    <TableCell>{complaint.display_name || 'Anonymous'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{complaint.city || complaint.state || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(complaint.status)}>
                        {complaint.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {complaint.priority && (
                        <Badge className={getPriorityColor(complaint.priority)}>
                          {complaint.priority}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      {getAuthorityForIssue(complaint.issue_type)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {format(new Date(complaint.created_at), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedComplaint(complaint)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Select
                          value={complaint.status || ''}
                          onValueChange={(value) => updateComplaintStatus(complaint.id, value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Registered">Registered</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Complaint Details Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complaint Details - {selectedComplaint?.complaint_code}</DialogTitle>
          </DialogHeader>
          
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Reporter: {selectedComplaint.display_name || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Location: {selectedComplaint.city}, {selectedComplaint.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Date: {format(new Date(selectedComplaint.created_at), 'PPP')}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Status & Assignment</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      Status: <Badge className={getStatusColor(selectedComplaint.status)}>{selectedComplaint.status}</Badge>
                    </div>
                    {selectedComplaint.priority && (
                      <div>
                        Priority: <Badge className={getPriorityColor(selectedComplaint.priority)}>{selectedComplaint.priority}</Badge>
                      </div>
                    )}
                    <div>
                      Authority: <span className="font-medium">{getAuthorityForIssue(selectedComplaint.issue_type)}</span>
                    </div>
                    {selectedComplaint.assigned_to && (
                      <div>Assigned to: {selectedComplaint.assigned_to}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm bg-muted p-3 rounded-lg">
                  {selectedComplaint.description}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminComplaintManagement