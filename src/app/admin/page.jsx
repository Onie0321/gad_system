"use client";
import React, { useState, useEffect } from "react";
import {
  Bell,
  Layout,
  Users,
  FileText,
  Settings,
  Edit,
  LogOut,
  Menu,
  Atom,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Switch } from "../../components/ui/switch";
import UserManagement from "./usermanagement/page";
import ReportsAnalytics from "./report&analytics/page";
import SystemSettings from "./settings/page";
import ContentManagement from "./contentmanagement/page";
import LogOutComponent from "./logout/page";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs"; // import Tabs related components
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../../components/ui/card"; // import Card component
import { format, formatDistanceToNow } from "date-fns"; // Import date-fns
import { appwriteConfig, databases } from "../../lib/appwrite"; // Import Appwrite configuration


const nav = [
  { icon: Layout, title: "Dashboard", id: "dashboard" },
  { icon: Users, title: "User Management", id: "users" },
  { icon: FileText, title: "Reports & Analytics", id: "reports" },
  { icon: Settings, title: "System Settings", id: "settings" },
  { icon: Edit, title: "Content Management", id: "content" },
  { icon: LogOut, title: "Log Out", id: "logout" },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [eventPercentageChange, setEventPercentageChange] = useState(0);
  const [participantPercentageChange, setParticipantPercentageChange] = useState(0);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
 // Fetch data from Appwrite
 useEffect(() => {
  const fetchUserData = async () => {
    try {
      // Fetch total users
      const usersResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId
      );
      setTotalUsers(usersResponse.total);

      // Fetch total events
      const eventsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.eventCollectionId
      );
      const currentTotalEvents = eventsResponse.total;
      setTotalEvents(currentTotalEvents);

      // Fetch total participants
      const participantsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.participantCollectionId
      );
      const currentTotalParticipants = participantsResponse.total;
      setTotalParticipants(currentTotalParticipants);

      // Calculate percentage changes
      const previousTotalEvents = 200; // Example previous count
      const previousTotalParticipants = 50; // Example previous count

      const eventChange =
        ((currentTotalEvents - previousTotalEvents) / previousTotalEvents) *
        100;
      const participantChange =
        ((currentTotalParticipants - previousTotalParticipants) /
          previousTotalParticipants) *
        100;

      setEventPercentageChange(eventChange.toFixed(1)); // Rounded to one decimal
      setParticipantPercentageChange(participantChange.toFixed(1)); // Rounded to one decimal

      // Fetch recent activities
      const activitiesResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.eventCollectionId
      );
      const formattedActivities = activitiesResponse.documents.map((activity) => {
        const date = new Date(activity.eventDate);
        const formattedDate = format(date, "MMMM d, yyyy h:mm a");
        const timeAgo = formatDistanceToNow(date, { addSuffix: true });

        return {
          ...activity,
          formattedDate: `${formattedDate} (${timeAgo})`,
        };
      });

      setRecentActivities(formattedActivities);
    } catch (error) {
      console.error("Error fetching data from Appwrite:", error);
    }
  };

  fetchUserData();
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
            <Atom className="h-8 w-8 text-blue-400 mr-2" />
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              G&D Admin
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
                  New user registration
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-blue-600">
                  Report ready for review
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-blue-600">
                  System update available
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          {activeTab === "dashboard" && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-gray-800 border-b border-blue-500">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-blue-600"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="demographics"
                  className="data-[state=active]:bg-blue-600"
                >
                  Demographics
                </TabsTrigger>
                <TabsTrigger
                  value="development"
                  className="data-[state=active]:bg-blue-600"
                >
                  Development Indicators
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-gray-800 border-blue-500 border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-blue-400">
                        Total Users
                      </CardTitle>
                      <Users className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                      {totalUsers}
                      </div>
                      <p className="text-xs text-blue-300">
                        +2.5% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-green-500 border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-green-400">
                        Event Added
                      </CardTitle>
                      <Layout className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">                        {totalEvents}
                      </div>
                      <p className="text-xs text-green-300">
                      {eventPercentageChange}% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-purple-500 border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-purple-400">
                        Participant Added
                      </CardTitle>
                      <FileText className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">                        {totalParticipants}
                      </div>
                      <p className="text-xs text-purple-300">
                      {participantPercentageChange}% from last month
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-gray-800 border border-blue-500">
                  <CardHeader>
                    <CardTitle className="text-blue-400">Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-center">
                          <span className="rounded-full bg-blue-500 p-2">
                            <Users className="h-4 w-4 text-white" />
                          </span>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-200">
                              {activity.eventName} {/* Adjust to match your data structure */}
                            </p>
                            <p className="text-sm text-gray-400">{activity.eventDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="demographics">
                <Card className="bg-gray-800 border border-blue-500">
                  <CardHeader>
                    <CardTitle className="text-blue-400">
                      Demographic Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white">
                      This section will provide insights into the demographic
                      data.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="development">
                <Card className="bg-gray-800 border border-blue-500">
                  <CardHeader>
                    <CardTitle className="text-blue-400">
                      Development Indicators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white">
                      This section will track development indicators.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {activeTab === "users" && <UserManagement />}
          {activeTab === "reports" && <ReportsAnalytics />}
          {activeTab === "settings" && <SystemSettings />}
          {activeTab === "content" && <ContentManagement />}
          {activeTab === "logout" && <LogOutComponent />}
        </div>
      </main>
    </div>
  );
}
