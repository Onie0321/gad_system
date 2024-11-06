"use client";

import React, { useState, useEffect } from "react";
import {
  UserCircle,
  Search,
  UserPlus2,
  Settings,
  Trash,
  FileText,
  PieChart,
  RefreshCcw,
  Mail,
  ShieldCheck,
  Activity,
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
import { getAllUsers } from "../../../lib/appwrite";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data);
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
      (roleFilter === "all" || roleFilter === "" || user.role === roleFilter) &&
      (statusFilter === "all" ||
        statusFilter === "" ||
        user.status === statusFilter)
  );

  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkAction = async (action) => {
    console.log(`Bulk ${action} for users:`, selectedUsers);
  };

  return (
    <Card className="bg-gray-800 border-4 border-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 shadow-lg shadow-blue-500/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <UserCircle className="h-10 w-10 mr-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400" />
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
              User Management
            </CardTitle>
            <CardDescription className="text-gray-400">
              View and manage user accounts
            </CardDescription>
          </div>
        </div>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white">
                <UserPlus2 className="h-4 w-4 mr-2" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white border-4 border-gradient-to-r from-emerald-500 via-blue-500 to-purple-500">
              <DialogHeader>
                <DialogTitle className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">
                  Add New User
                </DialogTitle>
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
                    className="col-span-3 bg-gray-700 text-white border-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    className="col-span-3 bg-gray-700 text-white border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3 bg-gray-700 text-white border-purple-500">
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
                <Button
                  variant="outline"
                  className="bg-gray-700 text-white border-emerald-500 hover:bg-emerald-600 hover:text-white"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <UserPlus2 className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            className="bg-gray-700 text-white border-blue-500 hover:bg-blue-600 hover:text-white"
          >
            <PieChart className="h-4 w-4 mr-2" />
            User Insights
          </Button>
          <Button
            variant="outline"
            className="bg-gray-700 text-white border-purple-500 hover:bg-purple-600 hover:text-white"
            onClick={fetchUsers}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-emerald-400" />
              <Input
                className="pl-8 bg-gray-700 text-white border-emerald-500"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px] bg-gray-700 text-white border-blue-500">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="officer">Officer</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-gray-700 text-white border-purple-500">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="bg-gray-700 text-white border-red-500 hover:bg-red-600 hover:text-white"
              onClick={() => handleBulkAction("delete")}
            >
              <Trash className="h-4 w-4 mr-2" />
              Bulk Delete
            </Button>
            <Button
              variant="outline"
              className="bg-gray-700 text-white border-blue-500 hover:bg-blue-600 hover:text-white"
              onClick={() => handleBulkAction("changeRole")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Change Role
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-700">
              <TableHead className="w-[50px]">
                <Checkbox
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedUsers(users.map((user) => user.id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead className="text-emerald-400">Name</TableHead>
              <TableHead className="text-blue-400">Email</TableHead>
              <TableHead className="text-purple-400">Role</TableHead>
              <TableHead className="text-emerald-400">Status</TableHead>
              <TableHead className="text-blue-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-b border-gray-700">
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => handleUserSelection(user.id)}
                  />
                </TableCell>
                <TableCell className="text-white">{user.name}</TableCell>
                <TableCell className="text-white">{user.email}</TableCell>
                <TableCell className="text-white">{user.role}</TableCell>
                <TableCell className="text-white">{user.status}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="bg-gray-700 text-emerald-400 border-emerald-500 hover:bg-emerald-600 hover:text-white"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-gray-700 text-blue-400 border-blue-500 hover:bg-blue-600 hover:text-white"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-gray-700 text-red-400 border-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
        checked
          ? "bg-gradient-to-r from-emerald-600 to-blue-600"
          : "bg-gray-600"
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
