"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, ChevronRight, Edit, Trash2 } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { v4 as uuidv4 } from "uuid"; // For unique IDs

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import Toast from "@/components/ui/toast"; // Assuming you have a Toast component

export default function EventManager() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEventName, setNewEventName] = useState("");
  const [newEventCategory, setNewEventCategory] = useState("Academic");
  const [newAttendee, setNewAttendee] = useState({
    id: "",
    name: "",
    age: "",
    gender: "Male",
    address: "",
    specialInfo: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [editingAttendee, setEditingAttendee] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [attendeeToDelete, setAttendeeToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState(null); // For notifications

  // Reset attendee form when edit dialog is closed
  useEffect(() => {
    if (!isEditDialogOpen) {
      resetAttendeeForm();
    }
  }, [isEditDialogOpen]);

  const resetAttendeeForm = () => {
    setNewAttendee({
      id: uuidv4(),
      name: "",
      age: "",
      gender: "Male",
      address: "",
      specialInfo: "",
      date: new Date().toISOString().split("T")[0],
    });
    setEditingAttendee(null);
  };

  const validateEventForm = () => {
    if (!newEventName.trim()) {
      setToastMessage("Event name cannot be empty.");
      return false;
    }
    if (!newEventCategory) {
      setToastMessage("Event category must be selected.");
      return false;
    }
    return true;
  };

  const validateAttendeeForm = () => {
    if (!newAttendee.name.trim()) {
      setToastMessage("Attendee name cannot be empty.");
      return false;
    }
    if (!newAttendee.age || newAttendee.age <= 0) {
      setToastMessage("Please enter a valid age.");
      return false;
    }
    return true;
  };

  const addEvent = () => {
    if (validateEventForm()) {
      const newEvent = {
        id: uuidv4(),
        name: newEventName,
        category: newEventCategory,
        attendees: [],
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      setNewEventName("");
      setNewEventCategory("Academic");
      setToastMessage("Event added successfully.");
    }
  };

  const addOrUpdateAttendee = () => {
    if (!validateAttendeeForm()) return;

    if (selectedEvent) {
      let updatedAttendees;
      if (editingAttendee) {
        updatedAttendees = selectedEvent.attendees.map((attendee) =>
          attendee.id === editingAttendee.id
            ? { ...editingAttendee, ...newAttendee }
            : attendee
        );
      } else {
        updatedAttendees = [
          ...selectedEvent.attendees,
          { ...newAttendee, id: uuidv4() },
        ];
      }
      const updatedEvent = {
        ...selectedEvent,
        attendees: updatedAttendees,
      };
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id ? updatedEvent : event
        )
      );
      setSelectedEvent(updatedEvent);
      resetAttendeeForm();
      setIsEditDialogOpen(false);
      setToastMessage("Attendee saved successfully.");
    }
  };

  const startEditingAttendee = (attendee) => {
    setEditingAttendee(attendee);
    setNewAttendee(attendee);
    setIsEditDialogOpen(true);
  };

  const deleteAttendee = () => {
    if (selectedEvent && attendeeToDelete) {
      const updatedEvent = {
        ...selectedEvent,
        attendees: selectedEvent.attendees.filter(
          (attendee) => attendee.id !== attendeeToDelete.id
        ),
      };
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id ? updatedEvent : event
        )
      );
      setSelectedEvent(updatedEvent);
      setAttendeeToDelete(null);
      setIsDeleteDialogOpen(false);
      setToastMessage("Attendee deleted successfully.");
    }
  };

  const getSummary = useMemo(() => {
    if (!selectedEvent) return null;

    const attendees = selectedEvent.attendees;
    const totalAttendees = attendees.length;
    const genderCount = attendees.reduce((acc, attendee) => {
      acc[attendee.gender] = (acc[attendee.gender] || 0) + 1;
      return acc;
    }, {});

    const ageGroups = attendees.reduce((acc, attendee) => {
      const ageGroup = Math.floor(attendee.age / 10) * 10;
      acc[`${ageGroup}-${ageGroup + 9}`] =
        (acc[`${ageGroup}-${ageGroup + 9}`] || 0) + 1;
      return acc;
    }, {});

    return {
      totalAttendees,
      genderCount,
      ageGroups,
    };
  }, [selectedEvent]);

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#8884D8"];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        className={`flex-1 flex flex-col overflow-hidden ${
          isSidebarOpen ? "ml-64" : ""
        } transition-all duration-300`}
      >
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4">
          <Tabs defaultValue="events" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="attendees">Attendees</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>
            <TabsContent value="events">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Add New Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="eventName">Event Name</Label>
                      <Input
                        id="eventName"
                        value={newEventName}
                        onChange={(e) => setNewEventName(e.target.value)}
                        className="bg-gray-700 border-gray-600"
                        aria-invalid={!newEventName.trim()}
                        aria-describedby="eventNameError"
                      />
                      {!newEventName.trim() && (
                        <span
                          id="eventNameError"
                          className="text-red-500 text-sm"
                        >
                          Event name is required.
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="eventCategory">Category</Label>
                      <Select
                        value={newEventCategory}
                        onValueChange={(value) => setNewEventCategory(value)}
                      >
                        <SelectTrigger
                          id="eventCategory"
                          className="bg-gray-700 border-gray-600"
                          aria-invalid={!newEventCategory}
                          aria-describedby="eventCategoryError"
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Academic">Academic</SelectItem>
                          <SelectItem value="Non-Academic">
                            Non-Academic
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {!newEventCategory && (
                        <span
                          id="eventCategoryError"
                          className="text-red-500 text-sm"
                        >
                          Event category is required.
                        </span>
                      )}
                    </div>
                    <Button
                      className="bg-blue-500 hover:bg-blue-600"
                      onClick={addEvent}
                      aria-label="Add Event"
                    >
                      <PlusCircle className="mr-2" /> Add Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-4 mt-4">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onSelectEvent={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="attendees">
              {selectedEvent ? (
                <div className="grid gap-4">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle>Add/Edit Attendee</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="attendeeName">Name</Label>
                          <Input
                            id="attendeeName"
                            value={newAttendee.name}
                            onChange={(e) =>
                              setNewAttendee({
                                ...newAttendee,
                                name: e.target.value,
                              })
                            }
                            className="bg-gray-700 border-gray-600"
                            aria-invalid={!newAttendee.name.trim()}
                            aria-describedby="attendeeNameError"
                          />
                          {!newAttendee.name.trim() && (
                            <span
                              id="attendeeNameError"
                              className="text-red-500 text-sm"
                            >
                              Attendee name is required.
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="attendeeAge">Age</Label>
                          <Input
                            id="attendeeAge"
                            type="number"
                            value={newAttendee.age}
                            onChange={(e) =>
                              setNewAttendee({
                                ...newAttendee,
                                age: e.target.value,
                              })
                            }
                            className="bg-gray-700 border-gray-600"
                            aria-invalid={
                              !newAttendee.age || newAttendee.age <= 0
                            }
                            aria-describedby="attendeeAgeError"
                          />
                          {(!newAttendee.age || newAttendee.age <= 0) && (
                            <span
                              id="attendeeAgeError"
                              className="text-red-500 text-sm"
                            >
                              Please enter a valid age.
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="attendeeGender">Gender</Label>
                          <Select
                            value={newAttendee.gender}
                            onValueChange={(value) =>
                              setNewAttendee({ ...newAttendee, gender: value })
                            }
                          >
                            <SelectTrigger
                              id="attendeeGender"
                              className="bg-gray-700 border-gray-600"
                            >
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="attendeeAddress">Address</Label>
                          <Input
                            id="attendeeAddress"
                            value={newAttendee.address}
                            onChange={(e) =>
                              setNewAttendee({
                                ...newAttendee,
                                address: e.target.value,
                              })
                            }
                            className="bg-gray-700 border-gray-600"
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="attendeeSpecialInfo">
                            Special Info
                          </Label>
                          <Input
                            id="attendeeSpecialInfo"
                            value={newAttendee.specialInfo}
                            onChange={(e) =>
                              setNewAttendee({
                                ...newAttendee,
                                specialInfo: e.target.value,
                              })
                            }
                            className="bg-gray-700 border-gray-600"
                          />
                        </div>
                        <Button
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={addOrUpdateAttendee}
                          aria-label={
                            editingAttendee ? "Update Attendee" : "Add Attendee"
                          }
                        >
                          <PlusCircle className="mr-2" />{" "}
                          {editingAttendee ? "Update Attendee" : "Add Attendee"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle>Attendees</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Age</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedEvent.attendees.map((attendee) => (
                            <TableRow key={attendee.id}>
                              <TableCell>{attendee.name}</TableCell>
                              <TableCell>{attendee.age}</TableCell>
                              <TableCell>{attendee.gender}</TableCell>
                              <TableCell>{attendee.address}</TableCell>
                              <TableCell>
                                <Button
                                  className="mr-2"
                                  onClick={() => startEditingAttendee(attendee)}
                                  aria-label={`Edit ${attendee.name}`}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => {
                                    setAttendeeToDelete(attendee);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  aria-label={`Delete ${attendee.name}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div>Please select an event to manage attendees.</div>
              )}
            </TabsContent>
            <TabsContent value="summary">
              {selectedEvent ? (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle>Event Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div>Total Attendees: {getSummary.totalAttendees}</div>
                      <div>
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={Object.entries(getSummary.genderCount).map(
                                ([gender, count], index) => ({
                                  name: gender,
                                  value: count,
                                  color: COLORS[index % COLORS.length],
                                })
                              )}
                              dataKey="value"
                              outerRadius={80}
                              label
                            >
                              {Object.entries(getSummary.genderCount).map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                )
                              )}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div>Please select an event to view the summary.</div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <EditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        attendee={newAttendee}
        onSave={addOrUpdateAttendee}
      />
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={deleteAttendee}
        attendee={attendeeToDelete}
      />
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}

// Extract EventCard as a reusable component
function EventCard({ event, onSelectEvent }) {
  return (
    <Card
      className="bg-gray-800 border-gray-700 cursor-pointer"
      onClick={onSelectEvent}
      role="button"
      tabIndex="0"
      aria-label={`Select event ${event.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelectEvent();
        }
      }}
    >
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>{event.category}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <ChevronRight />
      </CardFooter>
    </Card>
  );
}
