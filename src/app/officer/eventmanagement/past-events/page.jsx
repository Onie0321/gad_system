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
} from "@/components/ui/table";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Search,
  Download,
  Edit,
  Trash2,
  Users,
  ChartColumnBig,
  PlusCircle,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [showParticipants, setShowParticipants] = useState(false);
  const [participantSortColumn, setParticipantSortColumn] = useState("name");
  const [participantSortDirection, setParticipantSortDirection] =
    useState("asc");
  const [participantSearchTerm, setParticipantSearchTerm] = useState("");
  const [showDemographicAnalysis, setShowDemographicAnalysis] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    sex: "",
    age: "",
    department: "",
    year: "",
    section: "",
    ethnicGroup: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/addEvents");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Data is not an array");
      }
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

  const sortParticipants = (column) => {
    if (column === participantSortColumn) {
      setParticipantSortDirection(
        participantSortDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setParticipantSortColumn(column);
      setParticipantSortDirection("asc");
    }

    const sortedParticipants = [...selectedEvent.participants].sort((a, b) => {
      if (a[column] < b[column])
        return participantSortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column])
        return participantSortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setSelectedEvent({ ...selectedEvent, participants: sortedParticipants });
  };

  const exportEventData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Event Name,Date,Time,Venue,Type,Category,Number of Hours,Participants\n" +
      events
        .map(
          (event) =>
            `"${event.eventName}","${event.eventDate}","${event.eventTime}","${event.eventVenue}","${event.eventType}","${event.eventCategory}","${event.numberOfHours}","${event.participants.length}"`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "event_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateEvent = async (event) => {
    try {
      const response = await fetch("/api/addEvents", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: event.id,
          eventName: event.eventName,
          eventDate: event.eventDate,
          eventTime: event.eventTime,
          eventVenue: event.eventVenue,
          eventType: event.eventType,
          eventCategory: event.eventCategory,
          numberOfHours: parseInt(event.numberOfHours),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message}`
        );
      }

      await fetchEvents();
      setEditingEvent(null);
    } catch (error) {
      console.error("Error updating event:", error);
      setError(`Failed to update event: ${error.message}`);
    }
  };

  const updateParticipant = async (updatedParticipant) => {
    try {
      const response = await fetch("/api/addParticipants", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: updatedParticipant._id,
          name: updatedParticipant.name,
          sex: updatedParticipant.sex,
          age: parseInt(updatedParticipant.age),
          department: updatedParticipant.department,
          year: updatedParticipant.year,
          section: updatedParticipant.section,
          ethnicGroup: updatedParticipant.ethnicGroup,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update participant: ${errorData.message}`);
      }

      const updatedParticipantData = await response.json();

      setSelectedEvent((prevEvent) => ({
        ...prevEvent,
        participants: prevEvent.participants.map((p) =>
          p._id === updatedParticipantData._id ? updatedParticipantData : p
        ),
      }));

      setEditingParticipant(null);

      await fetchEvents();
    } catch (error) {
      console.error("Error updating participant:", error);
      setError(`Failed to update participant: ${error.message}`);
    }
  };

  const addParticipant = async (eventId) => {
    try {
      const response = await fetch("/api/addParticipants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          ...newParticipant,
          age: parseInt(newParticipant.age),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add participant: ${errorData.message}`);
      }

      const addedParticipant = await response.json();

      setSelectedEvent((prevEvent) => ({
        ...prevEvent,
        participants: [...prevEvent.participants, addedParticipant],
      }));

      setShowAddParticipant(false);
      setNewParticipant({
        name: "",
        sex: "",
        age: "",
        department: "",
        year: "",
        section: "",
        ethnicGroup: "",
      });

      await fetchEvents();
    } catch (error) {
      console.error("Error adding participant:", error);
      setError(`Failed to add participant: ${error.message}`);
    }
  };

  const getParticipantCount = (event) => {
    return event.participants ? event.participants.length : 0;
  };

  const filteredEvents = events.filter((event) => {
    if (!event || !event.eventName) {
      console.warn("Event with undefined name:", event);
      return false;
    }
    const matchesSearch = event.eventName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" || event.eventType === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredParticipants = selectedEvent?.participants.filter(
    (participant) =>
      participant.name &&
      participant.name
        .toLowerCase()
        .includes(participantSearchTerm.toLowerCase())
  );

  return (
    <Card className="w-full bg-gray-800 border-2 border-pink-500 rounded-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-pink-400">
          <Calendar className="inline-block mr-2" />
          Past Events
        </CardTitle>
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
          <Button
            onClick={exportEventData}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer text-pink-300"
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
                  className="cursor-pointer text-pink-300"
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
                  className="cursor-pointer text-pink-300"
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
                  className="cursor-pointer text-pink-300"
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
                  className="cursor-pointer text-pink-300"
                  onClick={() => sortEvents("participants")}
                >
                  Size{" "}
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
                    {getParticipantCount(event)}
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="bg-yellow-600 hover:bg-yellow-700">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Edit Event</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to edit this event?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => setEditingEvent(event)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <Button
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowParticipants(!showParticipants);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Users className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowDemographicAnalysis(true);
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
      </CardContent>

      {editingEvent && (
        <Dialog
          open={!!editingEvent}
          onOpenChange={() => setEditingEvent(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateEvent(editingEvent);
              }}
            >
              <Input
                value={editingEvent?.eventName}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    eventName: e.target.value,
                  })
                }
                placeholder="Event Name"
                className="mb-2"
              />
              <Input
                type="date"
                value={editingEvent?.eventDate.split("T")[0]}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    eventDate: e.target.value,
                  })
                }
                className="mb-2"
              />
              <Input
                value={editingEvent?.eventTime}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    eventTime: e.target.value,
                  })
                }
                placeholder="Event Time"
                className="mb-2"
              />
              <Input
                value={editingEvent?.eventVenue}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    eventVenue: e.target.value,
                  })
                }
                placeholder="Event Venue"
                className="mb-2"
              />
              <Select
                value={editingEvent?.eventType}
                onValueChange={(value) =>
                  setEditingEvent({
                    ...editingEvent,
                    eventType: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Non-Academic">Non-Academic</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={editingEvent?.eventCategory}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    eventCategory: e.target.value,
                  })
                }
                placeholder="Event Category"
                className="mb-2"
              />
              <Input
                type="number"
                value={editingEvent?.numberOfHours}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    numberOfHours: e.target.value,
                  })
                }
                placeholder="Number of Hours"
                className="mb-2"
              />
              <Button type="submit">Update Event</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {selectedEvent && showParticipants && (
        <Card className="bg-gray-800 border-2 border-pink-500 rounded-xl overflow-hidden mt-4">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-pink-400">
              <Users className="inline-block mr-2" />
              Participants for {selectedEvent.eventName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <Input
                icon={<Search className="w-4 h-4" />}
                placeholder="Search participants..."
                value={participantSearchTerm}
                onChange={(e) => setParticipantSearchTerm(e.target.value)}
                className="bg-gray-700 border-pink-500 text-white w-1/3"
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="text-pink-300 cursor-pointer"
                    onClick={() => sortParticipants("name")}
                  >
                    Name{" "}
                    {participantSortColumn === "name" &&
                      (participantSortDirection === "asc" ? (
                        <ChevronUp className="inline w-4 h-4" />
                      ) : (
                        <ChevronDown className="inline w-4 h-4" />
                      ))}
                  </TableHead>
                  <TableHead
                    className="text-pink-300 cursor-pointer"
                    onClick={() => sortParticipants("sex")}
                  >
                    Sex{" "}
                    {participantSortColumn === "sex" &&
                      (participantSortDirection === "asc" ? (
                        <ChevronUp className="inline w-4 h-4" />
                      ) : (
                        <ChevronDown className="inline w-4 h-4" />
                      ))}
                  </TableHead>
                  <TableHead
                    className="text-pink-300 cursor-pointer"
                    onClick={() => sortParticipants("age")}
                  >
                    Age{" "}
                    {participantSortColumn === "age" &&
                      (participantSortDirection === "asc" ? (
                        <ChevronUp className="inline w-4 h-4" />
                      ) : (
                        <ChevronDown className="inline w-4 h-4" />
                      ))}
                  </TableHead>
                  <TableHead
                    className="text-pink-300 cursor-pointer"
                    onClick={() => sortParticipants("department")}
                  >
                    Department{" "}
                    {participantSortColumn === "department" &&
                      (participantSortDirection === "asc" ? (
                        <ChevronUp className="inline w-4 h-4" />
                      ) : (
                        <ChevronDown className="inline w-4 h-4" />
                      ))}
                  </TableHead>
                  <TableHead
                    className="text-pink-300 cursor-pointer"
                    onClick={() => sortParticipants("year")}
                  >
                    Year{" "}
                    {participantSortColumn === "year" &&
                      (participantSortDirection === "asc" ? (
                        <ChevronUp className="inline w-4 h-4" />
                      ) : (
                        <ChevronDown className="inline w-4 h-4" />
                      ))}
                  </TableHead>
                  <TableHead
                    className="text-pink-300 cursor-pointer"
                    onClick={() => sortParticipants("section")}
                  >
                    Section{" "}
                    {participantSortColumn === "section" &&
                      (participantSortDirection === "asc" ? (
                        <ChevronUp className="inline w-4 h-4" />
                      ) : (
                        <ChevronDown className="inline w-4 h-4" />
                      ))}
                  </TableHead>
                  <TableHead
                    className="text-pink-300 cursor-pointer"
                    onClick={() => sortParticipants("ethnicGroup")}
                  >
                    Ethnic Group{" "}
                    {participantSortColumn === "ethnicGroup" &&
                      (participantSortDirection === "asc" ? (
                        <ChevronUp className="inline w-4 h-4" />
                      ) : (
                        <ChevronDown className="inline w-4 h-4" />
                      ))}
                  </TableHead>
                  <TableHead className="text-pink-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParticipants.map((participant) => (
                  <TableRow key={participant._id} className="hover:bg-gray-700">
                    <TableCell className="text-white">
                      {participant.name}
                    </TableCell>
                    <TableCell className="text-white">
                      {participant.sex}
                    </TableCell>
                    <TableCell className="text-white">
                      {participant.age}
                    </TableCell>
                    <TableCell className="text-white">
                      {participant.department}
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
                      <div className="flex space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button className="bg-yellow-600 hover:bg-yellow-700">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Edit Participant
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to edit this participant?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  setEditingParticipant(participant)
                                }
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {editingParticipant && (
        <Dialog
          open={!!editingParticipant}
          onOpenChange={() => setEditingParticipant(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Participant</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateParticipant(editingParticipant);
              }}
            >
              <Input
                value={editingParticipant?.name}
                onChange={(e) =>
                  setEditingParticipant({
                    ...editingParticipant,
                    name: e.target.value,
                  })
                }
                placeholder="Name"
                className="mb-2"
              />
              <Select
                value={editingParticipant?.sex}
                onValueChange={(value) =>
                  setEditingParticipant({
                    ...editingParticipant,
                    sex: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={editingParticipant?.age}
                onChange={(e) =>
                  setEditingParticipant({
                    ...editingParticipant,
                    age: e.target.value,
                  })
                }
                placeholder="Age"
                className="mb-2"
              />
              <Input
                value={editingParticipant?.department}
                onChange={(e) =>
                  setEditingParticipant({
                    ...editingParticipant,
                    department: e.target.value,
                  })
                }
                placeholder="Department"
                className="mb-2"
              />
              <Input
                value={editingParticipant?.year}
                onChange={(e) =>
                  setEditingParticipant({
                    ...editingParticipant,
                    year: e.target.value,
                  })
                }
                placeholder="Year"
                className="mb-2"
              />
              <Input
                value={editingParticipant?.section}
                onChange={(e) =>
                  setEditingParticipant({
                    ...editingParticipant,
                    section: e.target.value,
                  })
                }
                placeholder="Section"
                className="mb-2"
              />
              <Input
                value={editingParticipant?.ethnicGroup}
                onChange={(e) =>
                  setEditingParticipant({
                    ...editingParticipant,
                    ethnicGroup: e.target.value,
                  })
                }
                placeholder="Ethnic Group"
                className="mb-2"
              />
              <Button type="submit">Update Participant</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={showAddParticipant} onOpenChange={setShowAddParticipant}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Participant</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addParticipant(selectedEvent.id);
            }}
          >
            <Input
              value={newParticipant.name}
              onChange={(e) =>
                setNewParticipant({ ...newParticipant, name: e.target.value })
              }
              placeholder="Name"
              className="mb-2"
            />
            <Select
              value={newParticipant.sex}
              onValueChange={(value) =>
                setNewParticipant({ ...newParticipant, sex: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={newParticipant.age}
              onChange={(e) =>
                setNewParticipant({ ...newParticipant, age: e.target.value })
              }
              placeholder="Age"
              className="mb-2"
            />
            <Input
              value={newParticipant.department}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  department: e.target.value,
                })
              }
              placeholder="Department"
              className="mb-2"
            />
            <Input
              value={newParticipant.year}
              onChange={(e) =>
                setNewParticipant({ ...newParticipant, year: e.target.value })
              }
              placeholder="Year"
              className="mb-2"
            />
            <Input
              value={newParticipant.section}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  section: e.target.value,
                })
              }
              placeholder="Section"
              className="mb-2"
            />
            <Input
              value={newParticipant.ethnicGroup}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  ethnicGroup: e.target.value,
                })
              }
              placeholder="Ethnic Group"
              className="mb-2"
            />
            <DialogFooter>
              <Button type="submit">Add Participant</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
