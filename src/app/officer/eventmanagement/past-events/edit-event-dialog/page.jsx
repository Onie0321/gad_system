import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createEvent } from "../../../../../lib/appwrite";
import { getAcademicCategories } from "@/utils/categories";

export default function EditEventDialog({ event, onOpenChange, onUpdateEvent }) {
  const [editingEvent, setEditingEvent] = React.useState(event);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(editingEvent);
      onUpdateEvent();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  if (!event) return null;

  return (
    <Dialog open={!!event} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={editingEvent.eventName}
            onChange={(e) => setEditingEvent({ ...editingEvent, eventName: e.target.value })}
            placeholder="Enter Event Name"
            className="mb-2"
          />
          <Input
            type="date"
            value={editingEvent.eventDate.split("T")[0]}
            onChange={(e) => setEditingEvent({ ...editingEvent, eventDate: e.target.value })}
            placeholder="Select Event Date"
            className="mb-2"
          />
          <Input
            type="time"
            value={editingEvent.eventTimeFrom}
            onChange={(e) => setEditingEvent({ ...editingEvent, eventTimeFrom: e.target.value })}
            placeholder="Event Time From"
            className="mb-2"
          />
          <Input
            type="time"
            value={editingEvent.eventTimeTo}
            onChange={(e) => setEditingEvent({ ...editingEvent, eventTimeTo: e.target.value })}
            placeholder="Event Time To"
            className="mb-2"
          />
          <Input
            value={editingEvent.eventVenue}
            onChange={(e) => setEditingEvent({ ...editingEvent, eventVenue: e.target.value })}
            placeholder="Enter Event Venue"
            className="mb-2"
          />
          <Select
            value={editingEvent.eventType}
            onValueChange={(value) => setEditingEvent({ ...editingEvent, eventType: value, eventCategory: "" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Academic">Academic</SelectItem>
              <SelectItem value="Non-Academic">Non-Academic</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={editingEvent.eventCategory}
            onValueChange={(value) => setEditingEvent({ ...editingEvent, eventCategory: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Event Category" />
            </SelectTrigger>
            <SelectContent>
              {editingEvent.eventType === "Academic"
                ? getAcademicCategories().map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))
                : ["Sports", "Cultural", "Social", "Other"].map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={editingEvent.numberOfHours}
            readOnly
            placeholder="Number of Hours"
            className="mb-2"
          />
          <Button type="submit">Update Event</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}