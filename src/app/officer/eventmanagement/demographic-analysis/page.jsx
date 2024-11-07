'use client'

import React, { useState, useEffect  } from 'react'
import { Pie, PieChart, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { fetchAllParticipants, fetchAllEvents } from "@/lib/appwrite" // Import Appwrite functions


const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))']
const GENDER_COLORS = { Male: '#3b82f6', Female: '#ec4899' }

export default function DemographicAnalysis() {
  const [activeTab, setActiveTab] = useState('summary')
  const [participants, setParticipants] = useState([]) // Initialize as empty array
  const [events, setEvents] = useState([]) // Initialize events as empty array
  const [inputCriteria, setInputCriteria] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [suggestions, setSuggestions] = useState([]) // New state for suggestions
  const [error, setError] = useState('')

  useEffect(() => {
    // Fetch data when component mounts
    const fetchData = async () => {
      try {
        const participantsData = await fetchAllParticipants()
        const eventsData = await fetchAllEvents()
        setParticipants(participantsData)
        setEvents(eventsData)
      } catch (error) {
        console.error("Error loading data:", error)
        setError("Failed to load data.")
      }
    }
    fetchData()
  }, [])

  const cleanData = (item) => {
    const { $id, createdAt, updatedAt, permissions, databaseId, collectionId, ...filteredItem } = item
    return filteredItem
  }


  // Calculate distributions with gender breakdowns
  const calculateDistribution = (key) => {
    if (!participants.length) return [] // Return empty array if participants is not yet populated

    const distribution = participants.reduce((acc, participant) => {
      const category = participant[key]
      if (!acc[category]) {
        acc[category] = { Male: 0, Female: 0, Total: 0 }
      }
      acc[category][participant.sex]++
      acc[category].Total++
      return acc
    }, {})

    return Object.entries(distribution).map(([name, counts]) => ({
      name,
      Male: counts.Male,
      Female: counts.Female,
      Total: counts.Total
    }))
  }

  const sexData = calculateDistribution('sex')
  const schoolData = calculateDistribution('school')
  const yearData = calculateDistribution('year')
  const ethnicGroupData = calculateDistribution('ethnicGroup')

  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase()
    setInputCriteria(query)

    if (query) {
      // Collect all field values as potential suggestions
      const allData = [...participants, ...events]
      const potentialSuggestions = new Set() // Use Set to avoid duplicates

      allData.forEach(item => {
        Object.values(item).forEach(value => {
          if (typeof value === 'string' && value.toLowerCase().includes(query)) {
            potentialSuggestions.add(value)
          }
        })
      })

      setSuggestions([...potentialSuggestions].slice(0, 5)) // Limit to 5 suggestions
    } else {
      setSuggestions([]) // Clear suggestions when query is empty
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const keywords = inputCriteria.toLowerCase().split(/[,\s]+/).filter(Boolean)

    if (keywords.length === 0) {
      setError('Please provide at least one keyword for filtering.')
      return
    }

    const allData = [...participants, ...events]

    const filtered = allData.filter((item) => {
      const itemValues = Object.values(item).map(value =>
        typeof value === 'string' ? value.toLowerCase() : value.toString().toLowerCase()
      )
      return keywords.every(keyword => itemValues.some(value => value.includes(keyword)))
    })

    // Sort the filtered data alphabetically by eventName or name (if present)
    const sortedFilteredData = filtered
      .map(cleanData) // Remove unwanted fields from each item
      .sort((a, b) => {
        const aValue = a.eventName || a.name || ''
        const bValue = b.eventName || b.name || ''
        return aValue.localeCompare(bValue)
      })

    if (sortedFilteredData.length === 0) {
      setError('No data found matching the provided keywords.')
    } else {
      setError('')
    }

    setFilteredData(sortedFilteredData)
  }


  const renderGenderBreakdownTable = (data) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Male</TableHead>
          <TableHead>Female</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.name}>
            <TableCell>{item.name}</TableCell>
            <TableCell style={{ color: GENDER_COLORS.Male }}>{item.Male}</TableCell>
            <TableCell style={{ color: GENDER_COLORS.Female }}>{item.Female}</TableCell>
            <TableCell>{item.Total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Enhanced Demographic Analysis Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="summary">Summary Graphs</TabsTrigger>
          <TabsTrigger value="details">Detailed Table</TabsTrigger>
          <TabsTrigger value="subset">Subset Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sex Distribution</CardTitle>
                <CardDescription>Distribution of participants by sex</CardDescription>
              </CardHeader>
              <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sexData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="Total"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {sexData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={GENDER_COLORS[entry.name]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                {renderGenderBreakdownTable(sexData)}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>School Distribution</CardTitle>
                <CardDescription>Number of participants per school</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={schoolData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="Male"  fill={GENDER_COLORS.Male} />
                      <Bar dataKey="Female"  fill={GENDER_COLORS.Female} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                {renderGenderBreakdownTable(schoolData)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Year Distribution</CardTitle>
                <CardDescription>Number of participants per year</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="Male"  fill={GENDER_COLORS.Male} />
                      <Bar dataKey="Female"  fill={GENDER_COLORS.Female} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                {renderGenderBreakdownTable(yearData)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ethnic Group Distribution</CardTitle>
                <CardDescription>Number of participants per ethnic group</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ethnicGroupData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="Male"  fill={GENDER_COLORS.Male} />
                      <Bar dataKey="Female"  fill={GENDER_COLORS.Female} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                {renderGenderBreakdownTable(ethnicGroupData)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Participation</CardTitle>
                <CardDescription>Participation by gender for each event</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={events}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="eventName" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="maleParticipants" name="Male" fill={GENDER_COLORS.Male} />
                      <Bar dataKey="femaleParticipants" name="Female" fill={GENDER_COLORS.Female} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Male</TableHead>
                      <TableHead>Female</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.eventName}</TableCell>
                        <TableCell style={{ color: GENDER_COLORS.Male }}>{event.maleParticipants}</TableCell>
                        <TableCell style={{ color: GENDER_COLORS.Female }}>{event.femaleParticipants}</TableCell>
                        <TableCell>{event.totalParticipants}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Summary of event information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Name</TableHead>
                        
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Venue</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Male</TableHead>
                        <TableHead>Female</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>{event.eventName}</TableCell>
                          <TableCell>{event.dateOfEvent}</TableCell>
                          <TableCell>{`${event.eventTimeFrom} - ${event.eventTimeTo}`}</TableCell>
                          <TableCell>{event.eventVenue}</TableCell>
                          <TableCell>{event.eventType}</TableCell>
                          <TableCell>{event.eventCategory}</TableCell>
                          <TableCell style={{ color: GENDER_COLORS.Male }}>{event.maleParticipants}</TableCell>
                          <TableCell style={{ color: GENDER_COLORS.Female }}>{event.femaleParticipants}</TableCell>
                          <TableCell>{event.totalParticipants}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Participant Information</CardTitle>
              <CardDescription>Comprehensive data for all participants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Sex</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Ethnic Group</TableHead>
                      <TableHead>Other Ethnic Group</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant) => (
                      <TableRow key={participant.studentId}>
                        <TableCell>{participant.studentId}</TableCell>
                        <TableCell>{participant.name}</TableCell>
                        <TableCell style={{ color: GENDER_COLORS[participant.sex] }}>{participant.sex}</TableCell>
                        <TableCell>{participant.age}</TableCell>
                        <TableCell>{participant.school}</TableCell>
                        <TableCell>{participant.year}</TableCell>
                        <TableCell>{participant.section}</TableCell>
                        <TableCell>{participant.ethnicGroup}</TableCell>
                        <TableCell>{participant.otherEthnicGroup || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subset">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Subset Analysis</CardTitle>
              <CardDescription>
              Enter keywords to filter the data. You can search across all fields.
              Example: "IT week male" or "2022 Workshop"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="criteria">Analysis Criteria</Label>
                  <Input
                    id="criteria"
                    placeholder="Enter keywords (e.g., IT week male)"
                    value={inputCriteria}
                    onChange={(e) => setInputCriteria(e.target.value)}
                  />
                  
                </div>
                <Button type="submit">Analyze</Button>
              </form>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </CardContent>
          </Card>

          {filteredData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>Event details based on specified criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Event/Name</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.eventName || item.name}</TableCell>
                          <TableCell>{JSON.stringify(item)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}