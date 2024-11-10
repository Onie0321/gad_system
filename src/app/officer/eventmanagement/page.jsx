"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddEvent from "./add-events/page";
import AddParticipants from "./add-participants/page";
import PastEvents from "./past-events/page";
import DemographicAnalysis from "./demographic-analysis/page";
import { fetchEvents, addParticipantToEvent } from "../../../lib/appwrite";

export default function EventManagement() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    sex: "",
    age: "",
    school: "",
    year: "",
    section: "",
    ethnicGroup: "",
  });
  const [isAddingParticipants, setIsAddingParticipants] = useState(false);
  const [sortColumn, setSortColumn] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterType, setFilterType] = useState("all");
  const [selectedEventForAnalysis, setSelectedEventForAnalysis] =
    useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchEventData();
  }, []);

  const fetchEventData = async () => {
    try {
      const fetchedEvents = await fetchEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      toast.error("Failed to fetch events. Please try again.");
    }
  };

  const handleAddParticipant = async () => {
    const requiredFields = [
      "name",
      "sex",
      "age",
      "school",
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
      const updatedEvent = await addParticipantToEvent(
        selectedEvent.$id,
        newParticipant
      );
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.$id === updatedEvent.$id ? updatedEvent : event
        )
      );
      setNewParticipant({
        name: "",
        sex: "",
        age: "",
        school: "",
        year: "",
        section: "",
        ethnicGroup: "",
        otherEthnicGroup: "",
      });
      toast.success("Participant added successfully!");
    } catch (error) {
      console.error("Error adding participant:", error);
      toast.error(`An error occurred: ${error.message}`);
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

  const sortedEvents = [...events].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

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

  const handleShowDemographicAnalysis = (event) => {
    setSelectedEventForAnalysis(event);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Event Management</h1>
      <div className="grid grid-cols-3 gap-8">
        <AddEvent
          onEventCreated={(createdEvent) => {
            setSelectedEvent(createdEvent);
            setIsAddingParticipants(true);
            fetchEventData(); // Refresh the events list
          }}
        />

        <AddParticipants
          selectedEvent={selectedEvent}
          newParticipant={newParticipant}
          setNewParticipant={setNewParticipant}
          isAddingParticipants={isAddingParticipants}
          handleAddParticipant={handleAddParticipant}
          setEvents={setEvents}
          setIsAddingParticipants={setIsAddingParticipants} // Pass this prop
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
          handleShowDemographicAnalysis={handleShowDemographicAnalysis} // Will update selectedEventForAnalysis when clicked
          setSelectedEventForAnalysis={setSelectedEventForAnalysis} // Passing the function to update demographic analysis
        />
      </div>
      <div className="mt-8 space-y-8">
        {selectedEventForAnalysis && (
          <DemographicAnalysis selectedEventId={selectedEventForAnalysis} />
        )}
      </div>

      <ToastContainer limit={1} />
    </div>
  );
}
