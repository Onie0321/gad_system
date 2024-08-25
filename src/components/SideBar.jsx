import React from "react";
import { Button } from "@/components/ui/button";
import { Home, Users, Calendar, BarChart, Settings, X } from "lucide-react";

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 p-4 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <img
            src="/placeholder.svg?height=32&width=32"
            alt="GAD Logo"
            className="mr-2"
          />
          <div className="text-2xl font-bold">Event Manager</div>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <X className="h-6 w-6" />
        </Button>
      </div>
      <nav className="flex-1">
        <Button variant="ghost" className="w-full justify-start mb-2">
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button variant="ghost" className="w-full justify-start mb-2">
          <Calendar className="mr-2 h-4 w-4" />
          Events
        </Button>
        <Button variant="ghost" className="w-full justify-start mb-2">
          <Users className="mr-2 h-4 w-4" />
          Attendees
        </Button>
        <Button variant="ghost" className="w-full justify-start mb-2">
          <BarChart className="mr-2 h-4 w-4" />
          Analytics
        </Button>
        <Button variant="ghost" className="w-full justify-start mb-2">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </nav>
    </div>
  );
}
