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

export default function AddParticipants({
  selectedEvent,
  newParticipant,
  setNewParticipant,
  addParticipant,
  isAddingParticipants,
  finishAddingParticipants,
}) {
  const [hasAddedFirstParticipant, setHasAddedFirstParticipant] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) {
      toast.error("No event selected. Please select an event first.");
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
      await addParticipant(newParticipant);
      setHasAddedFirstParticipant(true); // Set the state to true after adding the first participant
    } catch (error) {
      console.error("Error adding participant:", error);
      toast.error(
        error.message || "Failed to add participant. Please try again."
      );
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
            Adding participants to: {selectedEvent.eventName} Event
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="department" className="text-blue-400">
              Department
            </Label>
            <Select
              onValueChange={(value) =>
                setNewParticipant({ ...newParticipant, department: value })
              }
              disabled={!isAddingParticipants}
            >
              <SelectTrigger
                id="department"
                className="bg-gray-700 border-blue-500 text-white"
              >
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IT">Information Technology</SelectItem>
                <SelectItem value="F">Forestry</SelectItem>
                <SelectItem value="E">Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                id="sex"
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

          <div className="space-y-2">
            <Label htmlFor="ethnicGroup" className="text-blue-400">
              Ethnic Group
            </Label>
            <Select
              onValueChange={(value) =>
                setNewParticipant({ ...newParticipant, ethnicGroup: value })
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
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {newParticipant.ethnicGroup === "Others" && (
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

        {isAddingParticipants && (
          <Button
            onClick={finishAddingParticipants}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
          >
            Finish Adding Participants
          </Button>
        )}

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
