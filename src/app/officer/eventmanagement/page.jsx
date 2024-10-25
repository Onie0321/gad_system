"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Plus,
  Clock,
  X,
  Save,
  Trash2,
  RefreshCw,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { differenceInHours, parse } from "date-fns";

import AddParticipants from "./add-participants/page";
import PastEvents from "./past-events/page";
import DemographicAnalysis from "./demographic-analysis/page";

export default function EventManagement() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    id: null,
    name: "",
    date: "",
    timeFrom: "",
    timeTo: "",
    venue: "",
    type: "Academic",
    category: "SoIT",
    numberOfHours: 0,
    participants: [],
  });
  const [tempEvent, setTempEvent] = useState(null);
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    sex: "",
    age: "",
    department: "",
    year: "",
    section: "",
    ethnicGroup: "",
    otherEthnicGroup: "",
  });
  const [sortColumn, setSortColumn] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [editingEvent, setEditingEvent] = useState(null);
  const [ageData, setAgeData] = useState({});
  const [isAddingParticipants, setIsAddingParticipants] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemographicAnalysis, setShowDemographicAnalysis] = useState(false);
  const [selectedEventForAnalysis, setSelectedEventForAnalysis] =
    useState(null);

  const calculateNumberOfHours = useCallback((timeFrom, timeTo) => {
    if (!timeFrom || !timeTo) return 0;
    const dateFrom = parse(timeFrom, "HH:mm", new Date());
    const dateTo = parse(timeTo, "HH:mm", new Date());
    return differenceInHours(dateTo, dateFrom);
  }, []);

  const handleTimeChange = useCallback(
    (field, value) => {
      setNewEvent((prev) => {
        const updatedEvent = { ...prev, [field]: value };
        const numberOfHours = calculateNumberOfHours(
          updatedEvent.timeFrom,
          updatedEvent.timeTo
        );
        return { ...updatedEvent, numberOfHours };
      });
    },
    [calculateNumberOfHours]
  );

  const academicCategories = [
    "School of Accountancy and Business Management",
    "School of Agricultural Science",
    "School of Arts and Sciences",
    "School of Education",
    "School of Engineering",
    "School of Fisheries and Oceanic Science",
    "School of Forestry and Environmental Sciences",
    "School of Industrial Technology",
    "School of Information Technology",
  ];
  const nonAcademicCategories = [
    "Accounting Unit",
    "Admission Office",
    "Budget Unit",
    "Cash Unit",
    "Data Protection Office",
    "Disaster Risk Reduction Management Office",
    "Extension and Rural Development Office",
    "Gender and Development Office",
    "General Services Unit",
    "Guidance Office",
    "Health Services Unit",
    "ICT Unit",
    "IGP and Auxiliary Office",
    "International, External, and Alumni Services Office",
    "Legal Unit",
    "Library",
    "National Service Training Program",
    "Office of Internal Audit",
    "Planning Unit",
    "Procurement Management Unit",
    "Project Management Unit",
    "Quality Assurance Management Office",
    "Records Unit",
    "Research and Development Office",
    "Scholarship Office",
    "Sentro ng Wika at Kultura",
    "Sports Development Unit",
    "Supply Unit",
    "Testing and Evaluation Center",
  ];

  const filteredCategories =
    newEvent.type === "Academic" ? academicCategories : nonAcademicCategories;

  const addEvent = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const requiredFields = [
      "name",
      "date",
      "timeFrom",
      "timeTo",
      "venue",
      "type",
      "category",
      "numberOfHours",
    ];
    const missingFields = requiredFields.filter((field) => !newEvent[field]);

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      setIsSubmitting(false);
      return;
    }

    const eventToAdd = {
      eventName: newEvent.name,
      eventDate: new Date(newEvent.date).toISOString(),
      eventTimeFrom: newEvent.timeFrom,
      eventTimeTo: newEvent.timeTo,
      eventVenue: newEvent.venue,
      eventType: newEvent.type,
      eventCategory: newEvent.category,
      numberOfHours: newEvent.numberOfHours,
    };

    try {
      const response = await fetch("/api/addEvents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventToAdd),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add event");
      }

      const addedEvent = await response.json();
      setEvents((prevEvents) => [...prevEvents, addedEvent.event]);
      setTempEvent(addedEvent.event); // This sets the newly created event as the tempEvent
      setIsAddingParticipants(true);
      setNewEvent({
        name: "",
        date: "",
        timeFrom: "",
        timeTo: "",
        venue: "",
        type: "Academic",
        category: "SoIT",
        numberOfHours: 0,
      });
      toast.success("Event added successfully! You can now add participants.");
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error(error.message || "Failed to add event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, newEvent]);

  const handleAddEvent = useCallback(async (eventData) => {
    try {
      const formattedData = {
        eventName: eventData.name,
        eventDate: new Date(eventData.date).toISOString(),
        eventTimeFrom: newEvent.timeFrom,
        eventTimeTo: newEvent.timeTo,
        eventVenue: eventData.venue,
        eventType: eventData.type,
        eventCategory: eventData.category,
        numberOfHours: eventData.numberOfHours,
      };

      const response = await fetch("/api/addEvents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (result.message === "An event with this exact name already exists.") {
        throw new Error("Event already added");
      }
    } catch (error) {
      console.error("Error during event creation:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/addEvents");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to fetch events. Please try again.");
      }
    };

    fetchEvents();
  }, []);

  const handleAddParticipant = async (eventId, participantData) => {
    try {
      const response = await fetch(`/api/addParticipants/${eventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(participantData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Participant added successfully!");
        return result.event;
      } else {
        throw new Error(result.message || "Failed to add participant.");
      }
    } catch (error) {
      console.error("Error adding participant:", error);
      toast.error(error.message || "An error occurred. Please try again.");
      throw error;
    }
  };

  const addParticipant = async () => {
    if (!tempEvent) {
      toast.error("Please select an event before adding participants.");
      return;
    }

    const requiredFields = [
      "name",
      "sex",
      "age",
      "department",
      "year",
      "section",
      "ethnicGroup",
    ];
    const missingFields = requiredFields.filter(
      (field) => !newParticipant[field]
    );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    try {
      const response = await fetch(`/api/addParticipants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newParticipant,
          eventId: tempEvent._id, // Use _id instead of id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add participant");
      }

      const result = await response.json();
      setTempEvent((prev) => ({
        ...prev,
        participants: [...(prev.participants || []), result.participant],
      }));
      setNewParticipant({
        name: "",
        sex: "",
        age: "",
        department: "",
        year: "",
        section: "",
        ethnicGroup: "",
        otherEthnicGroup: "",
      });
      toast.success("Participant added successfully!");
    } catch (error) {
      console.error("Error adding participant:", error);
      throw error;
    }
  };

  const finishAddingParticipants = () => {
    if (tempEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === tempEvent.id ? tempEvent : event
        )
      );
      setTempEvent(null);
      setIsAddingParticipants(false);
      toast.success("Participants added successfully!");
    }
  };

  const sortEvents = useCallback(
    (column) => {
      if (column === sortColumn) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortColumn(column);
        setSortDirection("asc");
      }
    },
    [sortColumn, sortDirection]
  );

  const exportEventData = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "event_data.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/addEvents");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events. Please try again.");
    }
  };

  const getAgeGroup = (age) => {
    if (isNaN(age)) {
      console.warn("Invalid age:", age);
      return "Unknown";
    }
    if (age < 18) return "Under 18";
    if (age < 25) return "18-24";
    if (age < 35) return "25-34";
    if (age < 45) return "35-44";
    return "45+";
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`/api/addEvents?id=${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event.");
      }

      setEvents(events.filter((event) => event.id !== eventId));
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    }
  };

  const refreshData = useCallback(async () => {
    await fetchEvents();
    toast.success("Data refreshed successfully!");
  }, [fetchEvents]);

  const handleShowDemographicAnalysis = useCallback((event) => {
    setSelectedEventForAnalysis(event);
    setShowDemographicAnalysis(true);
  }, []);

  const handleCloseDemographicAnalysis = useCallback(() => {
    setShowDemographicAnalysis(false);
    setSelectedEventForAnalysis(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Event Management</h1>
      <div className="grid grid-cols-3 gap-8">
        <Card className="col-span-1 bg-gray-800 border-2 border-purple-500 rounded-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-400">
              <Plus className="inline-block mr-2" />
              Add New Event
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addEvent();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="eventName" className="text-purple-300">
                  Event Name
                </Label>
                <Input
                  id="eventName"
                  value={newEvent.name}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, name: e.target.value })
                  }
                  className="bg-gray-700 border-purple-500 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventDate" className="text-purple-300">
                  Event Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal bg-gray-700 border-purple-500 text-white`}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newEvent.date ? (
                        format(new Date(newEvent.date), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={
                        newEvent.date ? new Date(newEvent.date) : undefined
                      }
                      onSelect={(date) =>
                        setNewEvent({
                          ...newEvent,
                          date: date ? format(date, "yyyy-MM-dd") : "",
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventTime" className="text-purple-300">
                  Event Time
                </Label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Label
                      htmlFor="timeFrom"
                      className="text-purple-300 text-sm"
                    >
                      From
                    </Label>
                    <Input
                      id="timeFrom"
                      type="time"
                      value={newEvent.timeFrom}
                      onChange={(e) =>
                        handleTimeChange("timeFrom", e.target.value)
                      }
                      className="bg-gray-700 border-purple-500 text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="timeTo" className="text-purple-300 text-sm">
                      To
                    </Label>
                    <Input
                      id="timeTo"
                      type="time"
                      value={newEvent.timeTo}
                      onChange={(e) =>
                        handleTimeChange("timeTo", e.target.value)
                      }
                      className="bg-gray-700 border-purple-500 text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="numberOfHours" className="text-purple-300">
                  Number of Hours
                </Label>
                <Input
                  id="numberOfHours"
                  type="text"
                  value={newEvent.numberOfHours}
                  readOnly
                  className="bg-gray-700 border-purple-500 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventVenue" className="text-purple-300">
                  Event Venue
                </Label>
                <Input
                  id="eventVenue"
                  value={newEvent.venue}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, venue: e.target.value })
                  }
                  className="bg-gray-700 border-purple-500 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventType" className="text-purple-300">
                  Event Type
                </Label>
                <Select
                  onValueChange={(value) =>
                    setNewEvent({ ...newEvent, type: value })
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-purple-500 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Non-Academic">Non-Academic</SelectItem>
                  </SelectContent>
                </Select>

                <div className="space-y-2">
                  <Label htmlFor="eventCategory" className="text-purple-300">
                    Event Category
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setNewEvent({ ...newEvent, category: value })
                    }
                  >
                    <SelectTrigger className="bg-gray-700 border-purple-500 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={addEvent}
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isSubmitting || isAddingParticipants}
              >
                <Plus className="mr-2" />
                {isSubmitting ? "Adding..." : "Add Event"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <AddParticipants
          selectedEvent={tempEvent}
          newParticipant={newParticipant}
          setNewParticipant={setNewParticipant}
          addParticipant={addParticipant}
          isAddingParticipants={isAddingParticipants}
          finishAddingParticipants={finishAddingParticipants}
        />
      </div>
      <div className="mt-8 space-y-8">
        <PastEvents
          events={sortedEvents}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          searchTerm={searchTerm}
          filterType={filterType}
          setSearchTerm={setSearchTerm}
          setFilterType={setFilterType}
          sortEvents={sortEvents}
          exportEventData={exportEventData}
          setEditingEvent={setEditingEvent}
          deleteEvent={deleteEvent}
          setSelectedEvent={setTempEvent}
          refreshData={refreshData}
          handleShowDemographicAnalysis={handleShowDemographicAnalysis}
        />
        <DemographicAnalysis selectedEventId={selectedEventForAnalysis?.id} />
      </div>

      <ToastContainer limit={1} />
    </div>
  );
}
