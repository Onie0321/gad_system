import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw } from "lucide-react";

export default function Confirm() {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4 text-cyan-300">Confirm Import</h3>
      <div className="space-y-2 text-white">
        <p>
          Records to be added: <span className="text-green-400">150</span>
        </p>
        <p>
          Records to be updated: <span className="text-yellow-400">20</span>
        </p>
        <p>
          Records to be skipped: <span className="text-red-400">5</span>
        </p>
      </div>
      <Button className="mt-4 bg-green-500 hover:bg-green-600 transition-all duration-300 shadow-glow">
        <RefreshCw className="mr-2 h-4 w-4" /> Start Import
      </Button>
      <div className="mt-8">
        <h4 className="text-xl font-semibold mb-2 text-cyan-300">Import History</h4>
        <Table className="bg-black bg-opacity-50 rounded-lg overflow-hidden">
          <TableHeader>
            <TableRow>
              <TableHead className="text-cyan-300">Date</TableHead>
              <TableHead className="text-cyan-300">Records Imported</TableHead>
              <TableHead className="text-cyan-300">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-cyan-800">
              <TableCell className="text-white">2023-05-15 14:30</TableCell>
              <TableCell className="text-white">175</TableCell>
              <TableCell className="text-green-500">Completed</TableCell>
            </TableRow>
            <TableRow className="border-b border-cyan-800">
              <TableCell className="text-white">2023-05-10 09:15</TableCell>
              <TableCell className="text-white">120</TableCell>
              <TableCell className="text-green-500">Completed</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  
  );
}