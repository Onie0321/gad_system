import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, AlertCircle } from "lucide-react";

export default function Validation() {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4 text-cyan-300">Data Validation</h3>
      <Table className="bg-black bg-opacity-50 rounded-lg overflow-hidden">
        <TableHeader>
          <TableRow>
            <TableHead className="text-cyan-300">Field</TableHead>
            <TableHead className="text-cyan-300">Status</TableHead>
            <TableHead className="text-cyan-300">Message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="border-b border-cyan-800">
            <TableCell className="text-white">Name</TableCell>
            <TableCell>
              <Check className="text-green-500" />
            </TableCell>
            <TableCell className="text-green-500">Valid</TableCell>
          </TableRow>
          <TableRow className="border-b border-cyan-800">
            <TableCell className="text-white">Email</TableCell>
            <TableCell>
              <AlertCircle className="text-yellow-500" />
            </TableCell>
            <TableCell className="text-yellow-500">2 duplicate entries found</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}