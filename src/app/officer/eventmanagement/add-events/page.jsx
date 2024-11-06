import React, { useState, useCallback } from "react";
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
import { Calendar, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, differenceInHours, parse } from "date-fns";
import { toast } from "react-toastify";
import { createEvent, checkDuplicateEvent } from "../../../../lib/appwrite";
import { getAcademicCategories, getNonAcademicCategories } from "@/utils/categories";

export default function AddEvent({ onEventCreated }) {
    const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    timeFrom: "",
    timeTo: "",
    venue: "",
    type: "",
    category: "",
    numberOfHours: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const academicCategories = getAcademicCategories();
  const nonAcademicCategories = getNonAcademicCategories();

  const filteredCategories =
    newEvent.type === "Academic" ? academicCategories : nonAcademicCategories;

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

  const validateForm = () => {
    const requiredFields = ["name", "date", "timeFrom", "timeTo", "venue", "type", "category"];
    const missingFields = requiredFields.filter(field => !newEvent[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return false;
    }
    return true;
  };

  const addEvent = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const isDuplicate = await checkDuplicateEvent({ eventName: newEvent.name });
      
      if (isDuplicate) {
        toast.error("An event with this name already exists.");
      } else {
        const createdEvent = await createEvent({
          eventName: newEvent.name,
          eventDate: newEvent.date,
          eventTimeFrom: newEvent.timeFrom,
          eventTimeTo: newEvent.timeTo,
          eventVenue: newEvent.venue,
          eventType: newEvent.type,
          eventCategory: newEvent.category,
          numberOfHours: newEvent.numberOfHours,
        });

        onEventCreated(createdEvent);

        setNewEvent({
          name: "",
          date: "",
          timeFrom: "",
          timeTo: "",
          venue: "",
          type: "",
          category: "",
          numberOfHours: 0,
        });

        toast.success("Event created successfully!");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error("Failed to add event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="col-span-1 bg-gray-800 border-2 border-purple-500 rounded-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-400">
          <Plus className="inline-block mr-2" />
          Add New Event
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addEvent} className="space-y-4">
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
              required
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
                  required
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
                  required
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
              required
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
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isSubmitting}
          >
            <Plus className="mr-2" />
            {isSubmitting ? "Adding..." : "Add Event"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}