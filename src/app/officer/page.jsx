"use client"

import React, { useState } from "react"
import { Atom, Bell, ChartPie, Calendar, Layout, Users, FileText, LogOut, Menu, BookText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card"

import EventManagement from "./eventmanagement/page";
import PersonnelStatistics from "./personnel/page"
import GoogleFormsImport from "./form/page"
import GADInitiatives from "./initiatives/page";
import Reports from "./reports/page";
import UserManagement from "./usermanagement/page";
import SystemSettings from "./settings/page";
import LogOutComponent from "./logout/page"; 

const nav = [
  { icon: Layout, title: "Dashboard", id: "dashboard" },
  { icon: Calendar, title: "Event Management", id: "event" },
  { icon: ChartPie, title: "Personnel Statistics", id: "personnel" },
  { icon: BookText, title: "Google Forms Import", id: "form" },
  { icon: Users, title: "System Settings", id: "settings" },
  { icon: LogOut, title: "Logout", id: "logout" },
]

export default function Officer() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  // Mock data for events
  const recentEvents = [
    { id: 1, name: "Orientation Day", date: "2023-08-15", unit: "School of Engineering" },
    { id: 2, name: "Career Fair", date: "2023-08-20", unit: "Career Services" },
    { id: 3, name: "Research Symposium", date: "2023-08-25", unit: "School of Sciences" },
  ]

  const academicEvents = [
    { id: 4, name: "IT Workshop", date: "2023-09-01", unit: "School of Information Technology" },
    { id: 5, name: "Business Ethics Seminar", date: "2023-09-05", unit: "School of Accountancy and Business Management" },
  ]

  const nonAcademicEvents = [
    { id: 6, name: "Health and Wellness Fair", date: "2023-09-10", unit: "Health Services Unit" },
    { id: 7, name: "Library Week", date: "2023-09-15", unit: "Library" },
  ]

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-800 transition-all duration-300 ease-in-out border-r border-blue-500`}
      >
        <div className="p-4 flex justify-between items-center">
          <div className={`flex items-center ${sidebarOpen ? "" : "hidden"}`}>
            <Atom className="h-8 w-8 text-blue-400 mr-2" />
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Officer Dashboard
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-blue-400 hover:text-blue-300"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <nav className="mt-6">
          {nav.map((item) => (
            <a
              key={item.id}
              className={`flex items-center py-3 px-4 ${
                activeTab === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              } ${
                sidebarOpen ? "" : "justify-center"
              } transition-all duration-200`}
              href="#"
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className={`${sidebarOpen ? "mr-2" : ""}`} size={20} />
              {sidebarOpen && <span>{item.title}</span>}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
        <header className="bg-gray-800 border-b border-blue-500 p-4 flex justify-between items-center">
          <h3 className="text-2xl font-medium text-blue-400">Dashboard</h3>
          <div className="flex items-center space-x-4">
            <Switch />
            <span className="text-sm">Dark Mode</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-gray-800 text-white border border-blue-500"
              >
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="focus:bg-blue-600">
                  New event created
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-blue-600">
                  Event update
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-blue-600">
                  New participant registered
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          {activeTab === "dashboard" && (
            <Tabs defaultValue="recent" className="w-full">
              <TabsList className="bg-gray-800 border-b border-blue-500">
                <TabsTrigger
                  value="recent"
                  className="data-[state=active]:bg-blue-600"
                >
                  Recent Events
                </TabsTrigger>
                <TabsTrigger
                  value="academic"
                  className="data-[state=active]:bg-blue-600"
                >
                  Academic Events
                </TabsTrigger>
                <TabsTrigger
                  value="nonacademic"
                  className="data-[state=active]:bg-blue-600"
                >
                  Non-Academic Events
                </TabsTrigger>
              </TabsList>
              <TabsContent value="recent">
                <Card className="bg-gray-800 border border-blue-500">
                  <CardHeader>
                    <CardTitle className="text-blue-400">Recent Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentEvents.map((event) => (
                        <div key={event.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-200">{event.name}</p>
                            <p className="text-xs text-gray-400">{event.unit}</p>
                          </div>
                          <p className="text-sm text-gray-400">{event.date}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="academic">
                <Card className="bg-gray-800 border border-blue-500">
                  <CardHeader>
                    <CardTitle className="text-blue-400">Academic Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {academicEvents.map((event) => (
                        <div key={event.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-200">{event.name}</p>
                            <p className="text-xs text-gray-400">{event.unit}</p>
                          </div>
                          <p className="text-sm text-gray-400">{event.date}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="nonacademic">
                <Card className="bg-gray-800 border border-blue-500">
                  <CardHeader>
                    <CardTitle className="text-blue-400">Non-Academic Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {nonAcademicEvents.map((event) => (
                        <div key={event.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-200">{event.name}</p>
                            <p className="text-xs text-gray-400">{event.unit}</p>
                          </div>
                          <p className="text-sm text-gray-400">{event.date}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {activeTab === "event" && <EventManagement />}
          {activeTab === "personnel" && <PersonnelStatistics />}          
          {activeTab === "form" && <GoogleFormsImport />}          
          {activeTab === "reports" && <Reports />}
          {activeTab === "settings" && <SystemSettings />}
          {activeTab === "logout" && <LogOutComponent />}
        </div>
      </main>
    </div>
  )
}