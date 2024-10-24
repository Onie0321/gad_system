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
} from "../../../../lib/appwrite"; // Your Appwrite function for adding participants

export default function AddParticipants({
  selectedEvent,
  newParticipant,
  setNewParticipant,
  isAddingParticipants,
  setEvents,
  setSelectedEvent,
  setIsAddingParticipants,
  handleAddParticipant,
}) {
  const [hasAddedFirstParticipant, setHasAddedFirstParticipant] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleAddParticipant();

    if (!selectedEvent || !selectedEvent.$id) {
      toast.error(
        "No event found. Please add an event before adding participants."
      );
      return;
    }

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

    if (
      newParticipant.ethnicGroup === "Other" &&
      !newParticipant.otherEthnicGroup
    ) {
      toast.error("Please specify the other ethnic group");
      return;
    }

    try {
      // Check if the participant already exists before adding them
      const isParticipantExists = await checkIfParticipantExists(
        selectedEvent.$id,
        newParticipant.name
      );

      if (isParticipantExists) {
        toast.error(
          "Participant with the same name already exists in this event."
        );
        return; // Exit early if the participant already exists
      }

      const updatedEvent = await addParticipantToEvent(
        selectedEvent.$id, // Pass the event ID to the function
        newParticipant
      );
      setSelectedEvent(updatedEvent);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      );

      // Clear the form after successfully adding a participant
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

      setHasAddedFirstParticipant(true);
      toast.success("Participant added successfully!");
    } catch (error) {
      console.error("Error adding participant:", error);
      toast.error(
        error.message || "Failed to add participant. Please try again."
      );
    }
  };

  const finishAddingParticipants = () => {
    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.$id === selectedEvent.$id ? selectedEvent : event
        )
      );

      setIsAddingParticipants(false);
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
      toast.success("Adding Participants Done");
    }
  };

  const validateAge = (value) => {
    const parsedValue = Number(value);

    // Check if the value is a positive integer and not NaN
    if (
      !isNaN(parsedValue) &&
      parsedValue > 0 &&
      Number.isInteger(parsedValue)
    ) {
      return parsedValue;
    } else if (value === "") {
      return ""; // Allow clearing the field
    }

    return null; // Invalid input
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
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Participant Name */}
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
              disabled={!isAddingParticipants}
            />
          </div>

          {/* Participant Sex */}
          <div className="space-y-2">
            <Label htmlFor="sex" className="text-blue-400">
              Sex
            </Label>
            <Select
              onValueChange={(value) =>
                setNewParticipant({ ...newParticipant, sex: value })
              }
              disabled={!isAddingParticipants}
            >
              <SelectTrigger
                id="sex"
                className="bg-gray-700 border-blue-500 text-white"
              >
                <SelectValue placeholder="Sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Participant Age */}
          <div className="space-y-2">
            <Label htmlFor="age" className="text-blue-400">
              Age
            </Label>
            <Input
              id="age"
              type="number"
              value={newParticipant.age}
              onChange={(e) => {
                const validatedAge = validateAge(e.target.value);

                if (validatedAge !== null) {
                  setNewParticipant({ ...newParticipant, age: validatedAge });
                }
              }}
              className="bg-gray-700 border-blue-500 text-white"
              disabled={!isAddingParticipants}
            />
          </div>

          {/* Participant School */}
          <div className="space-y-2">
            <Label htmlFor="school" className="text-blue-400">
              School
            </Label>
            <Select
              onValueChange={(value) =>
                setNewParticipant({ ...newParticipant, school: value })
              }
              disabled={!isAddingParticipants}
            >
              <SelectTrigger
                id="school"
                className="bg-gray-700 border-blue-500 text-white"
              >
                <SelectValue placeholder="School" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ABM">
                  School of Accountancy and Business Management
                </SelectItem>
                <SelectItem value="AS">
                  School of Agricultural Science
                </SelectItem>
                <SelectItem value="AAS">School of Arts and Sciences</SelectItem>
                <SelectItem value="ED">School of Education</SelectItem>
                <SelectItem value="ENG">School of Engineering</SelectItem>
                <SelectItem value="FOS">
                  School of Fisheries and Oceanic Science
                </SelectItem>
                <SelectItem value="FES">
                  School of Forestry and Environmental Sciences
                </SelectItem>
                <SelectItem value="IT">
                  School of Industrial Technology
                </SelectItem>
                <SelectItem value="IT2">
                  School of Information Technology
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Participant Year */}
          <div className="space-y-2">
            <Label htmlFor="year" className="text-blue-400">
              Year
            </Label>
            <Select
              onValueChange={(value) =>
                setNewParticipant({ ...newParticipant, year: value })
              }
              disabled={!isAddingParticipants}
            >
              <SelectTrigger
                id="year"
                className="bg-gray-700 border-blue-500 text-white"
              >
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="First">First Year</SelectItem>
                <SelectItem value="Second">Second Year</SelectItem>
                <SelectItem value="Third">Third Year</SelectItem>
                <SelectItem value="Fourth">Fourth Year</SelectItem>
                <SelectItem value="Fifth">Fifth Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Participant Section */}
          <div className="space-y-2">
            <Label htmlFor="section" className="text-blue-400">
              Section
            </Label>
            <Input
              id="section"
              value={newParticipant.section}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  section: e.target.value,
                })
              }
              className="bg-gray-700 border-blue-500 text-white"
              disabled={!isAddingParticipants}
            />
          </div>

          {/* Participant Ethnic Group */}
          <div className="space-y-2">
            <Label htmlFor="ethnicGroup" className="text-blue-400">
              Ethnic Group
            </Label>
            <Select
              onValueChange={(value) =>
                setNewParticipant({
                  ...newParticipant,
                  ethnicGroup: value,
                  otherEthnicGroup: "",
                })
              }
              disabled={!isAddingParticipants}
            >
              <SelectTrigger
                id="ethnicGroup"
                className="bg-gray-700 border-blue-500 text-white"
              >
                <SelectValue placeholder="Select Ethnic Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Agta">Agta</SelectItem>
                <SelectItem value="Ilokano">Ilokano</SelectItem>
                <SelectItem value="Ibanag">Ibanag</SelectItem>
                <SelectItem value="Ifugao">Ifugao</SelectItem>
                <SelectItem value="Tagalog">Tagalog</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {newParticipant.ethnicGroup === "Other" && (
            <div className="space-y-2">
              <Label htmlFor="otherEthnicGroup" className="text-blue-400">
                Specify Other Ethnic Group
              </Label>
              <Input
                id="otherEthnicGroup"
                value={newParticipant.otherEthnicGroup}
                onChange={(e) =>
                  setNewParticipant({
                    ...newParticipant,
                    otherEthnicGroup: e.target.value,
                  })
                }
                className="bg-gray-700 border-blue-500 text-white"
                disabled={!isAddingParticipants}
              />
            </div>
          )}

          {/* Add Participant Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!isAddingParticipants}
          >
            {hasAddedFirstParticipant
              ? "Add Another Participant"
              : "Add Participant"}
          </Button>
        </form>

        {/* Finish Adding Participants Button */}
        {isAddingParticipants && (
          <Button
            onClick={finishAddingParticipants}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
          >
            Finish Adding Participants
          </Button>
        )}

        {/* Warning Alert if no event is selected */}
        {!isAddingParticipants && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Please add new event before adding participants.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
