"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Search,
  Download,
  Edit,
  Users,
  ChartColumnBig,
  RefreshCw,
  PlusCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { fetchEvents, createEvent, checkDuplicateEvent  } from "../../../../lib/appwrite";
import AddParticipantDialog from "./add-participant-dialog/page";
import EditEventDialog from "./edit-event-dialog/page";
import EditParticipantDialog from "./edit-participant-dialog/page";
import ExportData from "./export-data/page";
import RefreshButton from "./refresh-button/page";
import ImportData from "./import-data/page";
import { parse } from "date-fns";
import { enUS } from "date-fns/locale";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toast styles


export default function PastEvents() {
  const [events, setEvents] = useState([]);
  const [sortColumn, setSortColumn] = useState("eventDate");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const tableRef = useRef(null);

  useEffect(() => {
    handleFetchEvents();
  }, []);

  const handleFetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(
        `Failed to load events: ${error.message}. Please try again later.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await handleFetchEvents();
    } finally {
      setIsRefreshing(false);
    }
  };

  const sortEvents = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    const sortedEvents = [...events].sort((a, b) => {
      if (a[column] < b[column]) return sortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setEvents(sortedEvents);
  };

  const filteredEvents = events.filter((event) => {
    const eventName = event.eventName || ""; // Fallback to empty string if eventName is undefined
    const matchesSearch = eventName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" || event.eventType === filterType;
    return matchesSearch && matchesFilter;
  });

  

  const handleImportData = async (importedData) => {
    const parseDateTime = (dateTimeStr) => {
      const formats = [
        "MM/dd/yyyy", // e.g. 02/23/2024
        "MMM/dd/yyyy", // e.g. Feb/23/2024
        "MMMM d, yyyy", // e.g. February 23, 2024
        "MM/dd/yyyy HH:mm", // e.g. 02/23/2024 14:30
        "h:mm a", // e.g. 2:30 PM
        "HH:mm", // e.g. 14:30
        "yyyy-MM-dd HH:mm", // ISO-like format without timezone
        "yyyy-MM-dd", // e.g. 2024-02-23
      ];
  
      let parsedDate = null;
  
      for (let format of formats) {
        try {
          parsedDate = parse(dateTimeStr, format, new Date(), { locale: enUS });
          if (!isNaN(parsedDate)) {
            return parsedDate.toISOString(); // If valid, return ISO string
          }
        } catch (e) {
          continue; // If parsing fails, move to the next format
        }
      }
  
      // Fallback: Try native Date constructor for flexible parsing
      const nativeDate = new Date(dateTimeStr);
      if (!isNaN(nativeDate.getTime())) {
        return nativeDate.toISOString(); // Return ISO string if valid
      }
  
      return null; // If no valid date format found, return null
    };
  
    const nonDuplicateEvents = []; // Store non-duplicate events for the UI update
    let skippedDuplicates = 0;
    let invalidEntries = 0;
  
    for (const item of importedData) {
      // Safely attempt to parse the event date and time
      const parsedEventDate = parseDateTime(item.Date);
      const parsedTimeFrom = item.EventTimeFrom;
      const parsedTimeTo = item.EventTimeTo;
  
      if (!item["Event Name"] || !parsedEventDate) {
        toast.error(`Invalid data in the row. Event Name or Date is missing for: ${item["Event Name"] || 'Unknown Event'}`);
        invalidEntries++;
        continue; // Skip the invalid entry
      }
  
      const event = {
        id: `imported-${item["Event Name"] || index}`, // Unique ID for each event
        eventName: item["Event Name"] || 'Unnamed Event',
        eventDate: parsedEventDate || new Date().toISOString(), // Default to current time if parsing fails
        eventTimeFrom: parsedTimeFrom || 'Unknown',
        eventTimeTo: parsedTimeTo || 'Unknown',
        eventVenue: item.Venue || 'Unknown Venue',
        eventType: item.Type || 'General',
        eventCategory: item.Category || 'Misc',
        numberOfHours: item["Number of Hours"] || 'N/A',
        participants: [],
      };
  
      try {
        // Check for duplicate event based on event name
        const isDuplicate = await checkDuplicateEvent(event);
        if (isDuplicate) {
          toast.warning(`Duplicate event found: ${event.eventName}. Skipping creation.`);
          skippedDuplicates++;
          continue; // Skip creating duplicate event
        }
  
        // If no duplicate found, create the event in Appwrite
        await createEvent(event);
  
        // Add the non-duplicate event to the local array for UI update
        nonDuplicateEvents.push(event);
      } catch (error) {
        console.error(`Error processing event ${event.eventName}:`, error);
      }
    }
  
    // Show success toast if any events were processed successfully
    if (nonDuplicateEvents.length > 0) {
      toast.success(`${nonDuplicateEvents.length} events imported successfully.`);
    }
  
    // Show a summary of skipped duplicates and invalid entries
    if (skippedDuplicates > 0) {
      toast.info(`${skippedDuplicates} duplicate events skipped.`);
    }
  
    if (invalidEntries > 0) {
      toast.info(`${invalidEntries} invalid entries were skipped.`);
    }
  
    // Update the local state with non-duplicate events only
    setEvents((prevEvents) => [...prevEvents, ...nonDuplicateEvents]);
  };

  return (
    <Card className="w-full bg-gray-800 border-2 border-pink-500 rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-pink-400">
          <Calendar className="inline-block mr-2" />
          Past Events
        </CardTitle>
        <RefreshButton onClick={handleRefresh} isRefreshing={isRefreshing} />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Input
            icon={<Search className="w-4 h-4" />}
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700 border-pink-500 text-white w-1/3"
          />
          <Select onValueChange={setFilterType} value={filterType}>
            <SelectTrigger className="bg-gray-700 border-pink-500 text-white w-1/3">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Academic">Academic</SelectItem>
              <SelectItem value="Non-Academic">Non-Academic</SelectItem>
            </SelectContent>
          </Select>
          <ExportData events={events} />
          <ImportData onImport={handleImportData} />
        </div>
        <div className="overflow-x-auto">
          <div ref={tableRef} className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer text-pink-300 sticky top-0 bg-gray-800"
                    onClick={() => sortEvents("eventName")}
                  >
                    Name{" "}
                    {sortColumn === "eventName" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="inline w-4 h-4" />
                      ) : (
                        <ChevronDown className="inline w-4 h-4" />
                      ))}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-pink-300 sticky top-0 bg-gray-800"
                    onClick={() => sortEvents("eventDate")}
                  >
                    Date{" "}
                    {sortColumn === "eventDate" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="inline w-4 h-4" />
                      ) : (
                        <ChevronDown className="inline w-4 h-4" />
                      ))}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-pink-300 sticky top-0 bg-gray-800"
                    onClick={() => sortEvents("eventType")}
                  >
                    Type{" "}
                    {sortColumn === "eventType" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="inline w-4 h-4" />
                      ) : (
                        <ChevronDown className="inline w-4 h-4" />
                      ))}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-pink-300 sticky top-0 bg-gray-800"
                    onClick={() => sortEvents("eventCategory")}
                  >
                    Category{" "}
                    {sortColumn === "eventCategory" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="inline w-4 h-4" />
                      ) : (
                        <ChevronDown className="inline w-4 h-4" />
                      ))}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-pink-300 sticky top-0 bg-gray-800"
                    onClick={() => sortEvents("participants")}
                  >
                    Number of Participant{" "}
                    {sortColumn === "participants" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="inline w-4 h-4" />
                      ) : (
                        <ChevronDown className="inline w-4 h-4" />
                      ))}
                  </TableHead>
                  <TableHead className="text-pink-300 text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id} className="hover:bg-gray-700">
                    <TableCell className="text-white">
                      {event.eventName}
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(event.eventDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      {event.eventType}
                    </TableCell>
                    <TableCell className="text-white">
                      {event.eventCategory}
                    </TableCell>
                    <TableCell className="text-white">
                      {event.participants?.length || 0}
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="flex space-x-2 justify-center">
                        <Button
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowAddParticipant(true);
                          }}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => setEditingEvent(event)}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => setSelectedEvent(event)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Users className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => {
                            // Implement demographic analysis functionality
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <ChartColumnBig className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      <AddParticipantDialog
        open={showAddParticipant}
        onOpenChange={setShowAddParticipant}
        event={selectedEvent}
        onAddParticipant={handleFetchEvents}
      />

      <EditEventDialog
        event={editingEvent}
        onOpenChange={() => setEditingEvent(null)}
        onUpdateEvent={handleFetchEvents}
      />

      <EditParticipantDialog
        participant={editingParticipant}
        onOpenChange={() => setEditingParticipant(null)}
        onUpdateParticipant={handleFetchEvents}
      />
    </Card>
  );
}
