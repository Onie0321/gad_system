import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ExportData({ events }) {
  const exportEventData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Event Name,Date,EventTimeFrom,EventTimeTo,Venue,Type,Category,Number of Hours,Participants\n" +
      events
        .map(
          (event) =>
            `"${event.eventName}","${event.eventDate}","${event.eventTimeFrom}","${event.eventTimeTo}","${event.eventVenue}","${event.eventType}","${event.eventCategory}","${event.numberOfHours}","${event.participants.length}"`
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

  return (
    <Button onClick={exportEventData} className="bg-green-600 hover:bg-green-700 text-white">
      <Download className="w-4 h-4 mr-2" />
      Export Data
    </Button>
  );
}