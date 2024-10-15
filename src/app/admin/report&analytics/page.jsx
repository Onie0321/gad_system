import React from "react";
import { FileText, BarChart, PieChart, LineChart } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export default function ReportsAnalytics() {
  return (
    <Card className="bg-gray-800 border border-blue-500">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-blue-400 mr-2" />
          <div>
            <CardTitle className="text-blue-400">Reports & Analytics</CardTitle>
            <CardDescription className="text-gray-400">
              View and generate reports
            </CardDescription>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Generate New Report
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <Card className="bg-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Gender Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center">
                <PieChart className="h-32 w-32 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Age Demographics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center">
                <BarChart className="h-32 w-32 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Development Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center">
                <LineChart className="h-32 w-32 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-400 mb-2">
            Recent Reports
          </h4>
          <ul className="space-y-2">
            <li className="text-gray-300">Gender Equality Index 2023</li>
            <li className="text-gray-300">
              Economic Empowerment Analysis Q2 2023
            </li>
            <li className="text-gray-300">Education Access Report 2023</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
