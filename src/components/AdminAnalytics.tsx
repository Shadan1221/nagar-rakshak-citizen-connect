import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ComposedChart } from "recharts"
import { supabase } from "@/integrations/supabase/client"
import { TrendingUp, MapPin, AlertTriangle, BarChart3 } from "lucide-react"

const AdminAnalytics = () => {
  const [complaintsByType, setComplaintsByType] = useState<any[]>([])
  const [complaintsByArea, setComplaintsByArea] = useState<any[]>([])
  const [topAreas, setTopAreas] = useState<any[]>([])
  const [trendData, setTrendData] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    inProgress: 0
  })

  const COLORS = ['hsl(var(--civic-saffron))', 'hsl(var(--civic-green))', 'hsl(var(--civic-blue))', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1']

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      // Fetch all complaints
      const { data: complaints, error } = await supabase
        .from('complaints')
        .select('*')

      if (error) throw error

      if (complaints) {
        // Process data for charts
        processComplaintsByType(complaints)
        processComplaintsByArea(complaints)
        processTopAreas(complaints)
        processTrendData(complaints)
        processStats(complaints)
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    }
  }

  const processComplaintsByType = (complaints: any[]) => {
    const typeCount: { [key: string]: number } = {}
    complaints.forEach(complaint => {
      const type = complaint.issue_type || 'Others'
      typeCount[type] = (typeCount[type] || 0) + 1
    })

    const data = Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
      percentage: ((count / complaints.length) * 100).toFixed(1)
    }))

    setComplaintsByType(data)
  }

  const processComplaintsByArea = (complaints: any[]) => {
    const areaCount: { [key: string]: number } = {}
    complaints.forEach(complaint => {
      const area = complaint.city || complaint.state || 'Unknown'
      areaCount[area] = (areaCount[area] || 0) + 1
    })

    const data = Object.entries(areaCount)
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    setComplaintsByArea(data)
  }

  const processTopAreas = (complaints: any[]) => {
    const areaCount: { [key: string]: number } = {}
    complaints.forEach(complaint => {
      const area = complaint.city || complaint.state || 'Unknown'
      areaCount[area] = (areaCount[area] || 0) + 1
    })

    const data = Object.entries(areaCount)
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    setTopAreas(data)
  }

  const processTrendData = (complaints: any[]) => {
    const trendMap: { [key: string]: { [key: string]: number } } = {}
    
    complaints.forEach(complaint => {
      const type = complaint.issue_type || 'Others'
      const area = complaint.city || complaint.state || 'Unknown'
      
      if (!trendMap[area]) {
        trendMap[area] = {}
      }
      trendMap[area][type] = (trendMap[area][type] || 0) + 1
    })

    const data = Object.entries(trendMap)
      .slice(0, 5)
      .map(([area, types]) => ({
        area,
        ...types
      }))

    setTrendData(data)
  }

  const processStats = (complaints: any[]) => {
    const stats = {
      total: complaints.length,
      pending: complaints.filter(c => c.status === 'Registered').length,
      inProgress: complaints.filter(c => c.status === 'In Progress').length,
      resolved: complaints.filter(c => c.status === 'Resolved').length
    }
    setStats(stats)
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-civic-saffron/10 to-civic-saffron/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-civic-saffron" />
              <div>
                <p className="text-2xl font-bold text-civic-saffron">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Complaints</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-civic-green/10 to-civic-green/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-civic-green" />
              <div>
                <p className="text-2xl font-bold text-civic-green">{stats.resolved}</p>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <Tabs defaultValue="issue-types" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="issue-types">Issue Types</TabsTrigger>
          <TabsTrigger value="areas">Areas</TabsTrigger>
          <TabsTrigger value="top-areas">Top Areas</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="issue-types">
          <Card>
            <CardHeader>
              <CardTitle>Complaints by Issue Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={complaintsByType}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--civic-saffron))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={complaintsByType}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ type, percentage }) => `${type}: ${percentage}%`}
                      >
                        {complaintsByType.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="areas">
          <Card>
            <CardHeader>
              <CardTitle>Complaints by Area/District</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complaintsByArea} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="area" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--civic-green))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-areas">
          <Card>
            <CardHeader>
              <CardTitle>Areas with Highest Complaints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topAreas.map((area, index) => (
                  <div key={area.area} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-civic-saffron to-civic-green text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{area.area}</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div 
                          className="bg-gradient-to-r from-civic-saffron to-civic-green h-2 rounded-full"
                          style={{ width: `${(area.count / topAreas[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-civic-saffron">{area.count}</p>
                      <p className="text-xs text-muted-foreground">complaints</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Trends: Issue Type vs Area</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="area" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="Electricity" fill={COLORS[0]} />
                    <Bar dataKey="Water Supply" fill={COLORS[1]} />
                    <Bar dataKey="Road Repair" fill={COLORS[2]} />
                    <Bar dataKey="Garbage Collection" fill={COLORS[3]} />
                    <Line type="monotone" dataKey="total" stroke={COLORS[4]} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminAnalytics