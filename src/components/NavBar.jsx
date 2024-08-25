import React from "react";
import { Button } from "@/components/ui/button";
import { Home, Mail, Info, Menu } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold ml-4">Event Management System</h1>
      </div>
      <nav>
        <Button variant="ghost" size="sm" className="mr-2">
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
        <Button variant="ghost" size="sm" className="mr-2">
          <Mail className="mr-2 h-4 w-4" />
          Contact
        </Button>
        <Button variant="ghost" size="sm">
          <Info className="mr-2 h-4 w-4" />
          About
        </Button>
      </nav>
    </header>
  );
}
