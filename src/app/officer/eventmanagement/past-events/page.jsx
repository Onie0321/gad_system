"use client";
import React, { useState, useEffect } from "react";
import DemographicAnalysis from "../demographic-analysis/page";
import { motion, AnimatePresence } from "framer-motion";
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
  TableFooter,
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
import {
  fetchEvents,
  createEvent,
  checkDuplicateEvent,
  fetchParticipants,
  appwriteConfig,
} from "../../../../lib/appwrite";
import AddParticipantDialog from "./add-participant-dialog/page";
import ParticipantsList from "./participants-dialog/page"; // Import your new ParticipantsDialog
import EditEventDialog from "./edit-event-dialog/page";
import EditParticipantDialog from "./edit-participant-dialog/page";
import ExportData from "./export-data/page";
import RefreshButton from "./refresh-button/page";
import ImportData from "./import-data/page";
import DemographicAnalysis from "../demographic-analysis/page"; // Import DemographicAnalysis component
import { parse } from "date-fns";
import { enUS } from "date-fns/locale";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the toast styles
import { Client } from "appwrite";

const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export default function PastEvents({ setSelectedEventForAnalysis }) {
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
  const [showParticipants, setShowParticipants] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null); // New state to store the event ID for analysis
  const [showDemographicAnalysis, setShowDemographicAnalysis] = useState(false); // New state to toggle visibility

  const tableRef = useRef(null);

  useEffect(() => {
    (async function fetchInitialEvents() {
      setIsLoading(true);
      try {
        const data = await fetchEvents({ limit: 20 }); // Limit initial fetch to 20 events for speed
        setEvents(data.map((event) => ({ ...event, participants: [] }))); // Start with participants as empty arrays
      } catch (error) {
        toast.error("Error loading events. Please try again.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.participantCollectionId}.documents`,
      (response) => {
        if (response.events.includes("databases.*.documents.*")) {
          const participant = response.payload;

          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.$id === participant.eventId
                ? {
                    ...event,
                    participants: [...event.participants, participant],
                  }
                : event
            )
          );
        }
      }
    );

    return () => {
      if (unsubscribe) unsubscribe(); // Clean up subscription when the component unmounts
    };
  }, []);

  const handleFetchEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchEvents();
      if (!data || data.length === 0) {
        throw new Error("No events found");
      }

      // Enrich each event with participant data and calculate counts
      const enrichedData = await Promise.all(
        data.map(async (event) => {
          if (!event.$id) {
            toast.error(
              `Event with missing ID encountered: ${event.eventName}`
            );
            return {
              ...event,
              participants: [],
              participantCount: 0,
              maleCount: 0,
              femaleCount: 0,
            };
          }

          try {
            // Use the updated fetchParticipants function
            const participants = await fetchParticipants(event.$id);

            // Calculate male and female participant counts
            const maleCount = participants.filter(
              (p) => p.sex === "Male"
            ).length;
            const femaleCount = participants.filter(
              (p) => p.sex === "Female"
            ).length;

            return {
              ...event,
              participants,
              participantCount: participants.length,
              maleCount,
              femaleCount,
            };
          } catch (error) {
            console.error(
              `Error fetching participants for event ID ${event.$id}:`,
              error
            );
            toast.error(
              `Error fetching participants for event: ${event.eventName}`
            );
            return {
              ...event,
              participants: [],
              participantCount: 0,
              maleCount: 0,
              femaleCount: 0,
            };
          }
        })
      );

      setEvents(enrichedData); // Update the events state with enriched data
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(
        error.message || "Failed to load events. Please try again later."
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

  const abbreviateType = (type) => {
    switch (type) {
      case "Academic":
        return "Aca";
      case "Non-Academic":
        return "Non-Aca";
      default:
        return type.substring(0, 3);
    }
  };

  const abbreviateCategory = (category) => {
    return category.length > 5 ? category.substring(0, 5) + "." : category;
  };

  const handleShowParticipants = async (event) => {
    try {
      const participants = await fetchParticipants(event.id); // Use the new fetchParticipants function
      setSelectedEvent({ ...event, participants }); // Update selected event with participants
      setShowParticipants(true); // Show participants dialog or list
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const calculateTotals = () => {
    const totalEvents = filteredEvents.length;
    const totalParticipants = filteredEvents.reduce(
      (sum, event) => sum + (event.participants?.length || 0),
      0
    );
    const totalByType = filteredEvents.reduce((acc, event) => {
      const shortType =
        event.eventType === "Academic"
          ? "Aca"
          : event.eventType === "Non-Academic"
          ? "Non-Aca"
          : event.eventType.substring(0, 3);
      acc[shortType] = (acc[shortType] || 0) + 1;
      return acc;
    }, {});

    const totalByCategory = filteredEvents.reduce((acc, event) => {
      const shortCategory =
        event.eventCategory.length > 10
          ? event.eventCategory.substring(0, 3) + "..."
          : event.eventCategory;
      acc[shortCategory] = (acc[shortCategory] || 0) + 1;
      return acc;
    }, {});

    return { totalEvents, totalParticipants, totalByType, totalByCategory };
  };

  const totals = calculateTotals();

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
        toast.error(
          `Invalid data in the row. Event Name or Date is missing for: ${
            item["Event Name"] || "Unknown Event"
          }`
        );
        invalidEntries++;
        continue; // Skip the invalid entry
      }

      const event = {
        id: `imported-${item["Event Name"] || index}`, // Unique ID for each event
        eventName: item["Event Name"] || "Unnamed Event",
        eventDate: parsedEventDate || new Date().toISOString(), // Default to current time if parsing fails
        eventTimeFrom: parsedTimeFrom || "Unknown",
        eventTimeTo: parsedTimeTo || "Unknown",
        eventVenue: item.Venue || "Unknown Venue",
        eventType: item.Type || "General",
        eventCategory: item.Category || "Misc",
        numberOfHours: item["Number of Hours"] || "N/A",
        participants: [],
      };

      try {
        // Check for duplicate event based on event name
        const isDuplicate = await checkDuplicateEvent(event);
        if (isDuplicate) {
          toast.warning(
            `Duplicate event found: ${event.eventName}. Skipping creation.`
          );
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
      toast.success(
        `${nonDuplicateEvents.length} events imported successfully.`
      );
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

  const handleParticipantAddition = (updatedEvent) => {
    // Fetch updated events data
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.$id === updatedEvent.$id ? updatedEvent : event
      )
    );
    handleFetchEvents(); // Re-fetch events from Appwrite
  };

  return (
    <Card className="w-full bg-gray-800 border-2 border-pink-500 rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-pink-400">
          <Calendar className="inline-block mr-2" />
          Past Events
        </CardTitle>
        <div className="flex items-center">
          <span className=" text-pink-400 mr-4">
            Total Events: {totals.totalEvents}
          </span>
          <RefreshButton onClick={handleRefresh} isRefreshing={isRefreshing} />
        </div>
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
                    Participant{" "}
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
                      Total: {event.participantCount} (Male: {event.maleCount},
                      Female: {event.femaleCount})
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
                          onClick={async () => {
                            if (event && event.$id) {
                              // Ensure event and event.id are available
                              setSelectedEvent(event); // Set the selected event
                              try {
                                const participants = await fetchParticipants(
                                  event.$id
                                ); // Fetch participants using event.id
                                setSelectedEvent({ ...event, participants }); // Update the selectedEvent with participants data
                                setShowParticipants(true); // Show the participants dialog
                              } catch (error) {
                                console.error(
                                  "Failed to fetch participants:",
                                  error
                                );
                              }
                            } else {
                              console.error("No eventId found for this event.");
                            }
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Users className="w-4 h-4" />
                        </Button>

                        <Button
                          onClick={() => setSelectedEventForAnalysis(event.$id)} // Sets the ID for demographic analysis
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <ChartColumnBig className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-gray-900 font-bold">
                  <TableCell className="text-white">Totals</TableCell>
                  <TableCell className="text-white">-</TableCell>
                  <TableCell className="text-white">
                    {Object.entries(totals.totalByType).map(([type, count]) => (
                      <div key={type}>
                        {type}: {count}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="text-white">
                    {Object.entries(totals.totalByCategory).map(
                      ([category, count]) => (
                        <div key={category}>
                          {category}: {count}
                        </div>
                      )
                    )}
                  </TableCell>
                  <TableCell className="text-white">
                    {totals.totalParticipants}
                  </TableCell>
                  <TableCell className="text-white">-</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </CardContent>
      {selectedEvent && <ParticipantsList event={selectedEvent} />}

      <AddParticipantDialog
        open={showAddParticipant}
        onOpenChange={setShowAddParticipant}
        event={selectedEvent}
        onAddParticipant={handleFetchEvents}
        handleParticipantAddition={handleParticipantAddition}
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
