import React from "react";
import { Edit, Search, Plus, FileText } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";

export default function ContentManagement() {
  return (
    <Card className="bg-gray-800 border border-blue-500">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Edit className="h-6 w-6 text-blue-400 mr-2" />
          <div>
            <CardTitle className="text-blue-400">Content Management</CardTitle>
            <CardDescription className="text-gray-400">
              Manage website content
            </CardDescription>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create New Content
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              className="pl-8 bg-gray-700 text-white border-blue-500"
              placeholder="Search content..."
            />
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-400 mb-2">
              Recent Updates
            </h4>
            <ul className="space-y-2">
              {[
                {
                  icon: FileText,
                  title: "Updated 'About Us' page",
                  date: "2 days ago",
                },
                {
                  icon: FileText,
                  title: "Added new blog post on gender equality",
                  date: "1 week ago",
                },
                {
                  icon: FileText,
                  title: "Updated privacy policy",
                  date: "2 weeks ago",
                },
              ].map((item, index) => (
                <li key={index} className="flex items-center text-gray-300">
                  <item.icon className="h-4 w-4 mr-2 text-blue-400" />
                  <span>{item.title}</span>
                  <span className="ml-auto text-sm text-gray-500">
                    {item.date}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
