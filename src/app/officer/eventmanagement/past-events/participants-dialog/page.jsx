"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Search, Download, Upload, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as XLSX from "xlsx";

export default function ParticipantsList({
  event = { eventName: "Default Event", participants: [] },
  onUpdateParticipant = () => {},
  onDeleteParticipant = () => {},
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterSex, setFilterSex] = useState("all");

  if (!event || !event.participants) return null;

  const filteredAndSortedParticipants = useMemo(() => {
    return event.participants
      .filter((participant) => {
        const matchesSearch = Object.values(participant).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesSexFilter =
          filterSex === "all" || participant.sex === filterSex;
        return matchesSearch && matchesSexFilter;
      })
      .sort((a, b) => {
        if (a[sortColumn] < b[sortColumn])
          return sortDirection === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn])
          return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [event.participants, searchTerm, filterSex, sortColumn, sortDirection]);

  const totalMale = useMemo(() => {
    return event.participants.filter((p) => p.sex === "Male").length;
  }, [event.participants]);

  const totalFemale = useMemo(() => {
    return event.participants.filter((p) => p.sex === "Female").length;
  }, [event.participants]);

  const handleSort = (column) => {
    setSortColumn(column);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredAndSortedParticipants);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participants");
    XLSX.writeFile(wb, `${event.eventName}_participants.xlsx`);
  };

  const importFromExcel = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      console.log("Imported data:", data);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <Card className="w-full mt-8 bg-gray-800 border-2 border-pink-500 rounded-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-pink-400 flex items-center justify-between">
          <div className="flex items-center">
            <Users className="inline-block mr-2" />
            Participants for {event.eventName}
          </div>
          <div className="text-lg space-x-4">
            <span>
              Total Participants: {filteredAndSortedParticipants.length}
            </span>
            <span>Male: {totalMale}</span>
            <span>Female: {totalFemale}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4 space-x-4">
          <div className="flex-grow">
            <Input
              placeholder="Search participants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 border-pink-500 text-white"
              icon={<Search className="text-pink-400" />}
            />
          </div>
          <Select value={filterSex} onValueChange={setFilterSex}>
            <SelectTrigger className="bg-gray-700 border-pink-500 text-white w-40">
              <SelectValue placeholder="Filter by sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-gray-700 border-pink-500 text-white"
              >
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToExcel}>
                <Download className="w-4 h-4 mr-2" />
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => document.getElementById("file-import").click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import from Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            id="file-import"
            type="file"
            accept=".xlsx, .xls"
            onChange={importFromExcel}
            style={{ display: "none" }}
          />
        </div>
        <div
          className={`overflow-x-auto ${
            filteredAndSortedParticipants.length > 5
              ? "max-h-80 overflow-y-auto"
              : ""
          }`}
        >
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "Student ID",
                  "Name",
                  "Age",
                  "Sex",
                  "School",
                  "Year",
                  "Section",
                  "Ethnic Group",
                  "Actions",
                ].map((header) => (
                  <TableHead
                    key={header}
                    className="text-pink-300 cursor-pointer"
                    onClick={() => handleSort(header.toLowerCase())}
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedParticipants.length > 0 ? (
                filteredAndSortedParticipants.map((participant, index) => (
                  <TableRow key={index} className="hover:bg-gray-700">
                    <TableCell className="text-white">
                      {participant.studentId}
                    </TableCell>
                    <TableCell className="text-white">
                      {participant.name}
                    </TableCell>
                    <TableCell className="text-white">
                      {participant.age}
                    </TableCell>
                    <TableCell className="text-white">
                      {participant.sex}
                    </TableCell>
                    <TableCell className="text-white">
                      {participant.school}
                    </TableCell>
                    <TableCell className="text-white">
                      {participant.year}
                    </TableCell>
                    <TableCell className="text-white">
                      {participant.section}
                    </TableCell>
                    <TableCell className="text-white">
                      {participant.ethnicGroup}
                    </TableCell>
                    <TableCell className="text-white">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onUpdateParticipant(participant)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteParticipant(participant.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-white">
                    No participants available for this event.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
