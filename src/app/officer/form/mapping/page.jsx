import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Mapping({ onFieldMapping }) {
 

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4 text-cyan-300">Map Fields</h3>
      <Table className="bg-black bg-opacity-50 rounded-lg overflow-hidden">
        <TableHeader>
          <TableRow>
            <TableHead className="text-cyan-300">Google Form Field</TableHead>
            <TableHead className="text-cyan-300">System Field</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockGoogleFormFields.map((field) => (
            <TableRow key={field} className="border-b border-cyan-800">
              <TableCell className="text-white">{field}</TableCell>
              <TableCell>
                <Select onValueChange={(value) => onFieldMapping(field, value)}>
                  <SelectTrigger className="bg-transparent border-cyan-500 text-white">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent className="bg-black text-white">
                    {mockSystemFields.map((systemField) => (
                      <SelectItem key={systemField} value={systemField}>
                        {systemField}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}