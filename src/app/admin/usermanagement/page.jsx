import React from "react";
import { Users, Search, UserPlus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function UserManagement() {
  return (
    <Card className="bg-gray-800 border border-blue-500">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-blue-400 mr-2" />
          <div>
            <CardTitle className="text-blue-400">User Management</CardTitle>
            <CardDescription className="text-gray-400">
              View and manage user accounts
            </CardDescription>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              className="pl-8 bg-gray-700 text-white border-blue-500"
              placeholder="Search users..."
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="p-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="p-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="p-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {[
                { name: "John Doe", email: "john@example.com", role: "Admin" },
                {
                  name: "Jane Smith",
                  email: "jane@example.com",
                  role: "Editor",
                },
                {
                  name: "Alice Johnson",
                  email: "alice@example.com",
                  role: "Viewer",
                },
              ].map((user, index) => (
                <tr
                  key={index}
                  className="bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <td className="p-2 whitespace-nowrap text-gray-300">
                    {user.name}
                  </td>
                  <td className="p-2 whitespace-nowrap text-gray-300">
                    {user.email}
                  </td>
                  <td className="p-2 whitespace-nowrap text-gray-300">
                    {user.role}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-400 border-blue-400"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
