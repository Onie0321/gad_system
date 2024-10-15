import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Download } from "lucide-react";

export default function Reports() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-indigo-400">Reports and Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" /> Download Gender Ratio Report
          </Button>
          <Button className="w-full bg-green-600 hover:bg-green-700">
            <Download className="mr-2 h-4 w-4" /> Download Employment Statistics
          </Button>
          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            <Download className="mr-2 h-4 w-4" /> Download Program Participation
            Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
