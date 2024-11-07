import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function ExportData({ events }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState("event_data.csv");

  // Calculate totals for events, academic, non-academic, participants, male, and female
  const calculateTotals = () => {
    const totalEvents = events.length;
    const totalAcademic = events.filter(event => event.eventType === "Academic").length;
    const totalNonAcademic = events.filter(event => event.eventType === "Non-Academic").length;
    const totalParticipants = events.reduce(
      (sum, event) => sum + (event.participants?.length || 0),
      0
    );
    const totalMale = events.reduce(
      (sum, event) => sum + (event.participants?.filter(p => p.sex === "Male").length || 0),
      0
    );
    const totalFemale = events.reduce(
      (sum, event) => sum + (event.participants?.filter(p => p.sex === "Female").length || 0),
      0
    );
    return { totalEvents, totalAcademic, totalNonAcademic, totalParticipants, totalMale, totalFemale };
  };

  const totals = calculateTotals();

  const exportEventData = () => {
    // Prepare the CSV content
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Event Name,Date,EventTimeFrom,EventTimeTo,Venue,Type,Category,Number of Hours,Participants,Total Male,Total Female\n" +
      events
        .map(
          (event) =>
            `"${event.eventName}","${new Date(event.eventDate).toLocaleDateString()}","${new Date(event.eventTimeFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}","${new Date(event.eventTimeTo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}","${event.eventVenue}","${event.eventType}","${event.eventCategory}","${event.numberOfHours}","${event.participants.length}","${event.participants.filter(p => p.sex === "Male").length}","${event.participants.filter(p => p.sex === "Female").length}"`
        )
        .join("\n") +
      // Add totals row at the end
      `\nTotals,"","","","","","Total Events: ${totals.totalEvents}, Academic: ${totals.totalAcademic}, Non-Academic: ${totals.totalNonAcademic}","","${totals.totalParticipants}","${totals.totalMale}","${totals.totalFemale}"`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
        <Download className="w-4 h-4 mr-2" />
        Export Data
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set File Name for Export</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="bg-gray-700 text-white px-2 py-1 rounded"
              placeholder="Enter file name"
            />
          </div>
          <DialogFooter>
            <Button onClick={() => { setIsModalOpen(false); exportEventData(); }} className="bg-green-600 hover:bg-green-700 text-white">
              Export
            </Button>
            <Button onClick={() => setIsModalOpen(false)} className="bg-red-600 hover:bg-red-700 text-white">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
