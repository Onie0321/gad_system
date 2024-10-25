"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  BarChart2,
  Shield,
  Mail,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in again");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
      toast({
        title: "Error",
        description: `Failed to fetch users: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchUsers();
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (roleFilter === "" || user.role === roleFilter) &&
      (statusFilter === "" || user.status === statusFilter)
  );

  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkAction = async (action) => {
    // Implement bulk actions (e.g., delete, change role, etc.)
    console.log(`Bulk ${action} for users:`, selectedUsers);
    // Add API call here
  };

  if (loading) {
    return (
      <Card className="bg-gray-800 border border-blue-500">
        <CardContent className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 text-blue-400 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-800 border border-red-500">
        <CardContent className="flex flex-col items-center justify-center h-64">
          <p className="text-red-400 mb-4">{error}</p>
          <Button
            onClick={handleRetry}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-2 border-blue-500 shadow-lg shadow-blue-500/50">
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
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account or send an invitation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3 bg-gray-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    className="col-span-3 bg-gray-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3 bg-gray-700 text-white">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="officer">Officer</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" className="bg-gray-700 text-white">
                  Send Invitation
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Create User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="bg-gray-700 text-white">
            <BarChart2 className="h-4 w-4 mr-2" />
            User Insights
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                className="pl-8 bg-gray-700 text-white border-blue-500"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px] bg-gray-700 text-white">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white">
                <SelectItem value="">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="officer">Officer</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-gray-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white">
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="bg-gray-700 text-white"
              onClick={() => handleBulkAction("delete")}
            >
              Bulk Delete
            </Button>
            <Button
              variant="outline"
              className="bg-gray-700 text-white"
              onClick={() => handleBulkAction("changeRole")}
            >
              Change Role
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-700">
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedUsers.length === filteredUsers.length}
                    onCheckedChange={(checked) => {
                      setSelectedUsers(
                        checked ? filteredUsers.map((u) => u._id) : []
                      );
                    }}
                  />
                </TableHead>
                <TableHead className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </TableHead>
                <TableHead className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </TableHead>
                <TableHead className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Role
                </TableHead>
                <TableHead className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user._id}
                  className="bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user._id)}
                      onCheckedChange={() => handleUserSelection(user._id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-gray-300">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-gray-300">{user.email}</TableCell>
                  <TableCell className="text-gray-300">{user.role}</TableCell>
                  <TableCell className="text-gray-300">{user.status}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-400 border-blue-400"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-400 border-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-400 border-green-400"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-700 text-white"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-700 text-white"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Checkbox({ checked, onCheckedChange }) {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={`${
        checked ? "bg-blue-600" : "bg-gray-600"
      } relative inline-flex h-5 w-9 items-center rounded-full`}
    >
      <span className="sr-only">Toggle selection</span>
      <span
        className={`${
          checked ? "translate-x-5" : "translate-x-1"
        } inline-block h-3 w-3 transform rounded-full bg-white transition`}
      />
    </Switch>
  );
}
