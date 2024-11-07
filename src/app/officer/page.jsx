"use client";

import React, { useState, useEffect } from "react";
import {
  Atom,
  Bell,
  ChartPie,
  Calendar,
  Layout,
  Users,
  FileText,
  LogOut,
  Menu,
  BookText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

import EventManagement from "./eventmanagement/page";
import PersonnelStatistics from "./personnel/page";
import GoogleFormsImport from "./form/page";
import DynamicExcelTable from "./initiatives/page";
import Reports from "./reports/page";
import UserManagement from "./usermanagement/page";
import SystemSettings from "./settings/page";
import LogOutComponent from "./logout/page";
import { fetchEvents } from "@/lib/appwrite";

const nav = [
  { icon: Layout, title: "Dashboard", id: "dashboard" },
  { icon: Calendar, title: "Event Management", id: "event" },
  { icon: ChartPie, title: "Personnel Statistics", id: "personnel" },
  { icon: BookText, title: "Google Forms Import", id: "form" },
  { icon: BookText, title: "Dynamic Excel Table", id: "excel" },
  { icon: Users, title: "System Settings", id: "settings" },
  { icon: LogOut, title: "Logout", id: "logout" },
];

const getTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
};

export default function Officer() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [events, setEvents] = useState({
    recent: [],
    academic: [],
    nonAcademic: [],
  });

  // Function to fetch events and categorize them
  const loadEvents = async () => {
    try {
      const fetchedEvents = await fetchEvents();
      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);

      // Filter and categorize events
      const recent = fetchedEvents.filter((event) => {
        const eventDate = new Date(event.$createdAt);
        return eventDate >= sevenDaysAgo && eventDate <= now;
      });
      const academic = fetchedEvents.filter(
        (event) => event.eventType === "Academic"
      );
      const nonAcademic = fetchedEvents.filter(
        (event) => event.eventType === "Non-Academic"
      );

      setEvents({ recent, academic, nonAcademic });
    } catch (error) {
      console.error("Error loading events:", error.message);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

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
            <img
              src="/logo/gad.png"
              alt="GAD Nexus Logo"
              width={40}
              height={40}
              className="object-contain"
            />{" "}
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
                    <CardTitle className="text-blue-400">
                      Recent Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {events.recent.map((event) => {
                        const $createdAt = new Date(event.$createdAt);
                        const formattedDate = $createdAt.toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        );

                        return (
                          <div
                            key={event.$id}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-200">
                                {event.eventName}
                              </p>
                              <p className="text-xs text-gray-400">
                                {event.unit}
                              </p>
                            </div>
                            <p className="text-sm text-gray-400">
                              {formattedDate} ({getTimeAgo($createdAt)})
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="academic">
                <Card className="bg-gray-800 border border-blue-500">
                  <CardHeader>
                    <CardTitle className="text-blue-400">
                      Academic Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {events.academic.map((event) => {
                        const $createdAt = new Date(event.$createdAt);
                        return (
                          <div
                            key={event.$id}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-200">
                                {event.eventName}
                              </p>
                              <p className="text-xs text-gray-400">
                                {event.unit}
                              </p>
                            </div>
                            <div className="text-sm text-gray-400">
                              {$createdAt.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}{" "}
                              ({getTimeAgo($createdAt)})
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="nonacademic">
                <Card className="bg-gray-800 border border-blue-500">
                  <CardHeader>
                    <CardTitle className="text-blue-400">
                      Non-Academic Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {events.nonAcademic.map((event) => {
                        const $createdAt = new Date(event.$createdAt);
                        return (
                          <div
                            key={event.$id}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-200">
                                {event.eventName}
                              </p>
                              <p className="text-xs text-gray-400">
                                {event.unit}
                              </p>
                            </div>
                            <div className="text-sm text-gray-400">
                              {$createdAt.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}{" "}
                              ({getTimeAgo($createdAt)})
                            </div>
                          </div>
                        );
                      })}
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
          {activeTab === "excel" && <DynamicExcelTable />}
          {activeTab === "logout" && <LogOutComponent />}
        </div>
      </main>
    </div>
  );
}
