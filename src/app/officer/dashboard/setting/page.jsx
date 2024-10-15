import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";

export default function SystemSettings() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-teal-400">System Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Program Categories
            </label>
            <Select>
              <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="employment">Employment</SelectItem>
                <SelectItem value="leadership">Leadership</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Data Sources
            </label>
            <Select>
              <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="census">National Census</SelectItem>
                <SelectItem value="survey">Annual Survey</SelectItem>
                <SelectItem value="program">Program Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full bg-teal-600 hover:bg-teal-700">
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
