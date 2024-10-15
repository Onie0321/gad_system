import React from "react";
import { Settings, Shield, Globe, Database } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Switch } from "../../../components/ui/switch";

export default function SystemSettings() {
  return (
    <Card className="bg-gray-800 border border-blue-500">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Settings className="h-6 w-6 text-blue-400 mr-2" />
          <div>
            <CardTitle className="text-blue-400">System Settings</CardTitle>
            <CardDescription className="text-gray-400">
              Configure system parameters
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-gray-300">
                Enable Two-Factor Authentication
              </span>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Globe className="h-4 w-4 text-green-400 mr-2" />
              <span className="text-gray-300">
                Allow Public Access to Reports
              </span>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-4 w-4 text-purple-400 mr-2" />
              <span className="text-gray-300">Enable API Access</span>
            </div>
            <Switch />
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
