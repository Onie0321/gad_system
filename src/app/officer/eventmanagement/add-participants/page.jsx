"use client";
import React, { useState } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import {
  addParticipantToEvent,
  checkIfParticipantExists,
  getParticipantByStudentId,
} from "@/lib/appwrite";
import { validateStudentId } from "@/utils/StudentIdValidation"; // Import the validation function

export default function AddParticipants({
  selectedEvent,
  setEvents,
  setSelectedEvent,
  setIsAddingParticipants,
}) {
  const [newParticipant, setNewParticipant] = useState({
    studentId: "",
    name: "",
    sex: "",
    age: "",
    school: "",
    year: "",
    section: "",
    ethnicGroup: "",
    otherEthnicGroup: "",
  });
  const [hasAddedFirstParticipant, setHasAddedFirstParticipant] =
    useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [maleCount, setMaleCount] = useState(0); // Track male count
  const [femaleCount, setFemaleCount] = useState(0); // Track female count
  const [selectedGenders, setSelectedGenders] = useState(new Set());
  const [isAddingParticipantsLocal, setIsAddingParticipantsLocal] =
    useState(false);
  const [showAlert, setShowAlert] = useState(false); // New state for alert
  const [studentIdWarning, setStudentIdWarning] = useState("");
  const [nameWarning, setNameWarning] = useState("");

  useEffect(() => {
    if (selectedEvent) {
      setIsAddingParticipantsLocal(true);
      setParticipantCount(selectedEvent.participants?.length || 0);
    } else {
      setIsAddingParticipantsLocal(false);
    }
  }, [selectedEvent]);

  // Real-time validation for Student ID
  useEffect(() => {
    const validateStudentIdAsync = async () => {
      if (!newParticipant.studentId) {
        setStudentIdWarning(""); // Clear warning if input is empty
        return;
      }
      try {
        const exists = await checkIfParticipantExists(
          selectedEvent.$id,
          newParticipant.studentId,
          ""
        );
        setStudentIdWarning(exists ? "This Student ID already exists." : "");
      } catch (error) {
        console.error("Error checking Student ID:", error);
      }
    };

    validateStudentIdAsync();
  }, [newParticipant.studentId, selectedEvent]);

  // Real-time validation for Name
  useEffect(() => {
    const validateNameAsync = async () => {
      if (!newParticipant.name) {
        setNameWarning(""); // Clear warning if input is empty
        return;
      }
      try {
        const exists = await checkIfParticipantExists(
          selectedEvent.$id,
          "",
          newParticipant.name
        );
        setNameWarning(exists ? "This Name already exists." : "");
      } catch (error) {
        console.error("Error checking Name:", error);
      }
    };

    validateNameAsync();
  }, [newParticipant.name, selectedEvent]);

  const resetForm = () => {
    setNewParticipant({
      studentId: "",
      name: "",
      sex: "",
      age: "",
      school: "",
      year: "",
      section: "",
      ethnicGroup: "",
      otherEthnicGroup: "",
    });
  };

  // Adjust handleStudentIdChange to log each step
  const handleStudentIdChange = async (value) => {
    setNewParticipant((prev) => ({ ...prev, studentId: value }));
    if (validateStudentId(value)) {
      try {
        const existingParticipant = await getParticipantByStudentId(value);
        if (existingParticipant) {
          setNewParticipant({
            ...existingParticipant,
            otherEthnicGroup: existingParticipant.otherEthnicGroup || "",
          });
          toast.info("Participant data autofilled successfully.");
        }
      } catch (error) {
        console.error("Error fetching participant data:", error);
        toast.error("Error fetching participant data. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (studentIdWarning || nameWarning) {
      toast.error("Please resolve the warnings before adding the participant.");
      return;
    }
    if (!/^\d{2}-\d{2}-\d{4}$/.test(newParticipant.studentId)) {
      toast.error("Student ID must follow the format XX-XX-XXXX");
      return;
    }

    try {
      const updatedEvent = await addParticipantToEvent(
        selectedEvent.$id,
        newParticipant
      );
      setSelectedEvent(updatedEvent);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.$id === updatedEvent.$id ? updatedEvent : event
        )
      );
      toast.success("Participant added successfully!");
      setNewParticipant({
        studentId: "",
        name: "",
        sex: "",
        age: "",
        school: "",
        year: "",
        section: "",
        ethnicGroup: "",
        otherEthnicGroup: "",
      });
    } catch (error) {
      console.error("Error adding participant:", error);
      toast.error(
        error.message || "Failed to add participant. Please try again."
      );
    }
  };
  const finishAddingParticipants = () => {
    if (selectedEvent) {
      // Update the events list in PastEvents
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.$id === selectedEvent.$id ? selectedEvent : event
        )
      );

      setIsAddingParticipants(false);
      resetForm();
      setShowAlert(true); // Show alert when finishing
      setIsAddingParticipantsLocal(false); // Disable further additions

      // Trigger the callback to fetch the latest events
      handleParticipantAddition(selectedEvent);

      toast.success("Adding Participants Done");
    } else {
      // Show warning if no event is selected
      toast.error("Please add a new event before adding participants.");
    }
  };

  const validateAge = (value) => {
    const parsedValue = Number(value);
    if (
      !isNaN(parsedValue) &&
      parsedValue > 0 &&
      Number.isInteger(parsedValue)
    ) {
      // Limit to 3 digits
      return String(parsedValue).slice(0, 3);
    }
    return "";
  };

  return (
    <Card className="col-span-2 bg-gray-800 border-2 border-blue-500 rounded-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-400">
          <Users className="inline-block mr-2" />
          Add Participants
        </CardTitle>
        {selectedEvent && (
          <p className="text-blue-300 mt-2">
            Adding participants to: {selectedEvent.eventName}
          </p>
        )}
        {selectedEvent && (
          <p className="text-blue-300 mt-2">
            Total Participants: {participantCount} (Male: {maleCount}, Female:{" "}
            {femaleCount})
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentId" className="text-blue-400">
              Student ID
            </Label>
            <Input
              id="studentId"
              value={newParticipant.studentId}
              onChange={(e) => handleStudentIdChange(e.target.value)}
              className="bg-gray-700 border-blue-500 text-white"
              placeholder="00-00-0000"
            />
            {studentIdWarning && (
              <p className="text-red-500 text-sm">{studentIdWarning}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-blue-400">
              Name
            </Label>
            <Input
              id="name"
              value={newParticipant.name}
              onChange={(e) =>
                setNewParticipant({ ...newParticipant, name: e.target.value })
              }
              className="bg-gray-700 border-blue-500 text-white"
            />
            {nameWarning && (
              <p className="text-red-500 text-sm">{nameWarning}</p>
            )}
          </div>
          <Button type="submit" className="bg-blue-500 text-white">
            Add Participant
          </Button>
        </form>
        {isAddingParticipantsLocal && (
          <Button
            onClick={finishAddingParticipants}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
          >
            Finish Adding Participants
          </Button>
        )}
        {!isAddingParticipantsLocal && showAlert && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Please add a new event before adding participants.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
