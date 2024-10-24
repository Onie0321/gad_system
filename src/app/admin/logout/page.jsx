import React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { signOut } from "../../../lib/appwrite"

export default function LogOutComponent() {
  const router = useRouter();

  // Handle log out
  const handleLogOut = async () => {
    try {
      await signOut(); // Call the signOut function
      router.push("/"); // Redirect to the home page
    } catch (error) {
      console.error("Sign out error:", error.message);
      // Optionally show an error message or toast
    }
  };
  return (
    <Card className="bg-gray-800 border border-blue-500">
      <CardHeader className="flex flex-row items-center">
        <LogOut className="h-6 w-6 text-blue-400 mr-2" />
        <div>
          <CardTitle className="text-blue-400">Log Out</CardTitle>
          <CardDescription className="text-gray-400">
            Are you sure you want to log out?
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700"
            onClick={handleLogOut}
          >
            Confirm Log Out
          </Button>
          <Button className="flex-1" variant="outline">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
