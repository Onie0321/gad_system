import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

export default function GADInitiatives() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-yellow-400">
          GAD Initiatives Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">Initiative</TableHead>
              <TableHead className="text-gray-300">Budget Allocated</TableHead>
              <TableHead className="text-gray-300">Participants</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-gray-300">
                Women's Entrepreneurship Program
              </TableCell>
              <TableCell className="text-green-400">$500,000</TableCell>
              <TableCell className="text-blue-400">250</TableCell>
              <TableCell className="text-yellow-400">In Progress</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-gray-300">
                Gender Equality in Education
              </TableCell>
              <TableCell className="text-green-400">$750,000</TableCell>
              <TableCell className="text-blue-400">1000</TableCell>
              <TableCell className="text-green-400">Ongoing</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-gray-300">
                Rural Women's Health Initiative
              </TableCell>
              <TableCell className="text-green-400">$300,000</TableCell>
              <TableCell className="text-blue-400">500</TableCell>
              <TableCell className="text-purple-400">Planning</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
